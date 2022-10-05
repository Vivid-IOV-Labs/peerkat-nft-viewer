import axios from "axios";
import { NFT } from "../models/NFT";
import { devlog } from "../utils/devlog";
// import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// GlobalWorkerOptions.workerSrc =
//   "../../node_modules/pdfjs-dist/build/pdf.worker.js";
// GlobalWorkerOptions.workerSrc =
//   "../../node_modules/pdfjs-dist/build/pdf.worker.js";
interface MyNamespacedWindow extends Window {
  "pdfjs-dist/build/pdf": any;
}

declare let window: MyNamespacedWindow;

const PDFJS = window["pdfjs-dist/build/pdf"];

// PDFJS.GlobalWorkerOptions.workerSrc =
//   "//mozilla.github.io/pdf.js/build/pdf.worker.js";
PDFJS.disableWorker = true;
// const ipfsPublicGateway = import.meta.env.VITE_PUBLIC_IPFS_GATEWAY;
// const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
const walletSecret = import.meta.env.VITE_WALLET_SECRET;
const walletSecretAlice = import.meta.env.VITE_WALLET_SECRET_ALICE;

const xrpl = (window as any).xrpl;
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
  balanceFormatted: string;
  limitFormatted: string;
};
function isNFT({ balance, currency }: line): boolean {
  const isNFTRegex = /^(\d{16})(e-)(85|86|87|89|90|91|92|93|94|95|96)$/;
  const isCurrencyCorrect =
    currency.length === 40 &&
    /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/.test(currency);
  const allCheck = isNFTRegex.test(balance) && isCurrencyCorrect;
  return allCheck;
}
function formatXrpCurrency(xrpcurrency: string): string {
  const last2 = Number(xrpcurrency.slice(-2));
  const index = 96 - last2 + 1;
  const ret = xrpcurrency.slice(0, index);
  return ret;
}

function is_hexadecimal(str: string): boolean {
  const regexp = /^[0-9a-fA-F]+$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}

function hexToString(hex: string) {
  const strhex = hex.toString(); //force conversion
  let str = "";
  for (let i = 0; i < strhex.length; i += 2)
    str += String.fromCharCode(parseInt(strhex.substr(i, 2), 16));
  return str.trim();
}
function truncate(
  fullStr: string,
  strLen = 8,
  separator = " ............. ",
  frontChars = 8
) {
  if (fullStr.length <= strLen) return fullStr;
  return fullStr.substr(0, frontChars) + separator;
}

async function getMediaType(url: string) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("Content-Type");
    return contentType;
  } catch (err) {
    return "";
  }
}
function getXLSProtocol(source: string): string {
  if (/(http|https|ipfs):\/\//.test(source) || source.includes("ipfs.io")) {
    return "xls-14";
  } else if (/(hash)?:/.test(source)) {
    return "xls-16-peerkat";
  } else {
    return "";
  }
}
async function getMediaByXLSProtocol(
  source: string,
  xlsProtocol: string,
  tokenName?: string
): Promise<string> {
  if (xlsProtocol == "xls-14") {
    const protocol = source.split("//")[0];
    return protocol + "//" + tokenName;
  } else if (xlsProtocol == "xls-16-peerkat") {
    const cid = source.split(":")[1];
    const { url } = await getIpfsMedia(cid);
    return url;
  } else {
    return "";
  }
}
function getTokenName(currency: string): string {
  const removeFirst02 = currency.replace("02", "");
  const first14char = removeFirst02.substring(0, 14);
  const proposedHex = hexToString(first14char);
  const isNotWord = /[^\w\\_\-\\,\\(\\)\\.\\@\\#\s]/gm.test(proposedHex);
  if (isNotWord) {
    return hexToString(removeFirst02.substring(14)).replace(/[^\w\s]/gi, "");
  } else {
    return hexToString(removeFirst02).replace(/[^\w\s]/gi, "");
  }
}
function getCtiHex(currency: string): string {
  const removeFirst02 = currency.replace("02", "");
  return removeFirst02.substring(0, 14);
}
// function cti_is_simple(cti: bigint) {
//   return cti >> 56n == 0;
// }
function cti_transaction_index(cti: bigint) {
  return (cti >> 32n) & 0xffffn;
}
function cti_ledger_index(cti: bigint) {
  return cti & 0xffffffffn;
}
function cti_ledger_check(cti: bigint) {
  return (cti >> 52n) & 0xfn;
}
function cti_transaction_check(cti: bigint) {
  return (cti >> 48n) & 0xfn;
}

function hexToDec(s: string) {
  let i,
    j,
    // eslint-disable-next-line prefer-const
    digits: number[] = [0],
    carry;
  for (i = 0; i < s.length; i += 1) {
    carry = parseInt(s.charAt(i), 16);
    for (j = 0; j < digits.length; j += 1) {
      digits[j] = digits[j] * 16 + carry;
      carry = (digits[j] / 10) | 0;
      digits[j] %= 10;
    }
    while (carry > 0) {
      digits.push(carry % 10);
      carry = (carry / 10) | 0;
    }
  }
  return digits.reverse().join("");
}
function isXls14Solo(currency: string) {
  const first6 = currency.slice(0, 6);
  //const next10 = currency.slice(6, 16);
  const last24 = currency.slice(-24);
  const first6ofLast24 = last24.slice(0, 6);
  const isNFT = first6 === "023031" && hexToString(first6ofLast24) === "NFT";
  return isNFT;
}
const decodeHtmlEntity = function (str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
};

async function getOne(
  account_data: any,
  account: string,
  currency = "",
  balanceFormatted?: string,
  limitFormatted?: string
) {
  const { Domain } = account_data;
  const source = is_hexadecimal(hexToString(Domain))
    ? hexToString(hexToString(Domain))
    : hexToString(Domain);
  let url;
  let media_type;
  let desc;
  let author;
  let tokenName = "";
  let sololimitFormatted;
  let standard;
  let error_code = "";
  let error_message = "";

  const ctiHex = getCtiHex(currency);
  const ctiDecimal = hexToDec(ctiHex);
  const ctiDecimalString = ctiDecimal.toString();
  const ctiBigInt = BigInt(ctiDecimalString);
  const ledgerIndex = cti_ledger_index(ctiBigInt);
  const ledgerIndexDecimal = Number(ledgerIndex);
  const transactionIndex = cti_transaction_index(ctiBigInt);
  const transactionIndexDecimal = Number(transactionIndex);
  tokenName = getTokenName(currency);
  async function geXls14() {
    const xlsProtocol = getXLSProtocol(source);
    if (xlsProtocol) {
      url = await getMediaByXLSProtocol(source, xlsProtocol, tokenName);
      media_type = await getMediaType(url);
      if (media_type == "application/json") {
        const { image } = await fetch(url).then((res) => res.json());
        if (image) {
          url = await getMediaByXLSProtocol(image, "xls-16-peerkat");
          media_type = await getMediaType(url);
        }
      } else if (media_type?.includes("text/html")) {
        const { url: metadataUrl } = await getIpfsMedia(
          source.split("ipfs/")[1]
        );
        const data = await getPdfContent(metadataUrl);
        const res = await getIpfsMedia(data["Image IPFS CID"]);
        url = res.url;
        media_type = await getMediaType(url);
        author = data["Design"];
      }
    }
  }

  if (isXls14Solo(currency)) {
    //const { url: metadataUrl } = await getIpfsMedia(source.split("//")[1]);
    try {
      // const promise = await fetch(metadataUrl);
      // const collection = await promise.json();
      const collection = await getIpfsJson(source.split("//")[1]);
      const { nfts } = collection;
      if (nfts) {
        const nft = nfts.find((n: any) => n.currency == currency);
        const { content_type, metadata } = nft;
        const { url: metadaNftUrl } = await getIpfsMedia(
          metadata.split("//")[1]
        );
        const res = await fetch(metadaNftUrl).then((res) => res.json());
        desc = decodeHtmlEntity(res.description);
        tokenName = res.name;
        sololimitFormatted = collection.collection_item_count;
        const fil_ext = content_type.split("/")[1];
        const { url: mediaUrl } = await getIpfsMedia(
          metadata.split("//")[1].replace("metadata.json", `data.${fil_ext}`)
        );
        media_type = content_type;
        url = mediaUrl;
        standard = "XLS-14d/SOLO";
      } else {
        error_code = "no_nfts_in_collection";
        error_message = "Individual metadata for this XLS14/SOLO NFT not found";
      }
    } catch (error) {
      devlog(error);
      await geXls14();
    }
  } else if (
    ledgerIndexDecimal.toString().length >= 8 &&
    ledgerIndexDecimal.toString().length <= 9
  ) {
    const metadata = await getMetadata(
      ledgerIndexDecimal,
      transactionIndexDecimal
    );
    if (metadata) {
      const uri = metadata.find((m: any) => m.type == "PrimaryUri").data;
      desc = decodeHtmlEntity(
        metadata
          .find((m: any) => m.type == "Description")
          .data.replace("â", "")
          .replace("Â", "")
      );
      author = metadata.find((m: any) => m.type == "Author").data;
      const res = await getIpfsMedia(uri.split("//")[1]);
      url = res.url;
      media_type = await getMediaType(url);
    } else {
      await geXls14();
    }
  } else {
    await geXls14();
  }
  return {
    issuer: account,
    issuerTruncated: truncate(account),
    currency,
    tokenName: tokenName,
    url,
    media_type,
    balanceFormatted,
    limitFormatted: sololimitFormatted ? sololimitFormatted : limitFormatted,
    desc,
    standard,
    author,
    error_code,
    error_message,
  };
}
let client: any;
async function getPdfContent(url: string) {
  const doc = await PDFJS.getDocument(url).promise;
  const page = await doc.getPage(1);

  const textContent = await page.getTextContent();

  let lastY,
    text = "";
  for (const item of textContent.items as any) {
    if (lastY == item.transform[5] || !lastY) {
      text += item.str;
    } else {
      text += "\n" + item.str;
    }
    lastY = item.transform[5];
  }
  return text.split(/\r\n|\r|\n/).reduce((acc: any, line) => {
    const key = line.split(":")[0] as string;
    const val = line.split(":")[1] as string;
    acc[key] = val.trim();
    return acc;
  }, {});
}
async function connect() {
  await client.connect();
}
async function disconnect() {
  await client.disconnect();
}

async function getMetadata(ledger_index: number, transactionIndex: number) {
  try {
    const { result } = await client.request({
      command: "ledger",
      ledger_index: ledger_index,
      transactions: true,
      binary: false,
      expand: true,
    });

    const { ledger, error } = result;
    if (error) {
      throw new Error(error);
    } else {
      const getTransaction = ledger.transactions.find((t: any) => {
        return t.metaData.TransactionIndex == transactionIndex;
      });
      const metadata = getTransaction.Memos.map(({ Memo }: any) => {
        const { MemoData, MemoFormat, MemoType } = Memo;
        return {
          data: hexToString(MemoData),
          format: hexToString(MemoFormat),
          type: hexToString(MemoType),
        };
      });
      return metadata;
    }
  } catch (error) {
    return null;
  }
}
async function recurseFetchNftLines(
  walletAddress: string,
  accLines: line[],
  prev_marker?: string
): Promise<line[]> {
  const { result } = await client.request({
    command: "account_lines",
    account: walletAddress,
    marker: prev_marker,
  });
  const { lines, error, marker } = result;
  if (error) {
    throw new Error(error);
  }

  accLines = [...accLines, ...lines];
  if (marker) {
    return await recurseFetchNftLines(walletAddress, accLines, marker);
  } else {
    return accLines;
  }
}

async function fetchNftLines(walletAddress: string): Promise<any> {
  const accLines = await recurseFetchNftLines(walletAddress, []);
  const nftLines = accLines.filter(isNFT).map(function (line: line) {
    return {
      ...line,
      balanceFormatted: formatXrpCurrency(line.balance),
      limitFormatted: formatXrpCurrency(line.limit),
    };
  });
  return nftLines;
  // }

  // catch (error) {
  //   devlog("fetchNftLines Error ", error);
  // }
}

async function fetchIssuerCurrencies(issuer: string): Promise<any> {
  const { result } = await client.request({
    command: "account_currencies",
    account: issuer,
  });
  const { receive_currencies } = result;

  return receive_currencies[0];
}
async function fetchOne(
  account: string,
  currency?: string,
  balanceFormatted?: string,
  limitFormatted?: string
): Promise<NFT> {
  const allReps = await client.request({
    command: "account_info",
    account,
  });
  const { result, error, error_code, error_message } = allReps;
  const { account_data } = result;

  if (currency) {
    return await getOne(
      account_data,
      account,
      currency,
      balanceFormatted,
      limitFormatted
    );
  } else {
    const issuerCurrency = await fetchIssuerCurrencies(account);

    return await getOne(
      account_data,
      account,
      issuerCurrency,
      balanceFormatted,
      limitFormatted
    );
  }
}
async function fetchNext(nextLines: line[]): Promise<NFT[]> {
  const nextNfts: NFT[] = await Promise.all(
    nextLines.map(async (line: line) => {
      const { account, currency, balanceFormatted, limitFormatted } = line;
      const one = await fetchOne(
        account,
        currency,
        balanceFormatted,
        limitFormatted
      );
      return one;
    })
  );
  return nextNfts;
}

export async function getTokens(walletAddress: string): Promise<any> {
  const nfts = await client.request({
    method: "account_nfts",
    account: walletAddress,
  });
  return nfts;
}

export async function fetchOneXls20(
  walletAddress: string,
  NFTokenID: string
): Promise<any> {
  const {
    result: { account_nfts },
  } = await getTokens(walletAddress);
  const nftXLS20 = account_nfts.find((n: any) => {
    return n.NFTokenID == NFTokenID;
  });
  if (nftXLS20) {
    return getOneXls(nftXLS20);
  } else {
    throw new Error("Not an XLS-20");
  }
}
export async function getOneXls(nft: any) {
  let mediaUrl;
  let media_type;
  let error_code;
  let error_message;
  let tokenName;
  let desc;
  const { Issuer, NFTokenID, URI, NFTokenTaxon } = nft;
  const uri = hexToString(URI);
  const end = uri.includes(".json")
    ? ""
    : Number.isInteger(NFTokenTaxon)
    ? `/${NFTokenTaxon}.json`
    : "/base.json";
  const url =
    uri.split("//")[0] === "ipfs:" ? uri.split("//")[1] + end : uri + end;
  try {
    const { description, image, name, schema, video, animate_url } = details;
    // const schmeaUri =
    //   schema.split("//")[0] === "ipfs:"
    //     ? schema.split("//")[1] + "/$Schema.json"
    //     : schema + "/%24Schema.json ";

    // try {
    //   const res =
    //     schema.split("//")[0] === "ipfs:"
    //       ? await getIpfsJson(schmeaUri)
    //       : await fetch(url).then((r) => r.json());
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }

    tokenName = name.replace(/[^\w\s]/gi, "");
    desc = description;
    if (image) {
      if (image.split("//")[0] === "ipfs:") {
        const { url: imageUrl } = await getIpfsMedia(image.split("//")[1]);
        mediaUrl = imageUrl;
      } else {
        mediaUrl = image;
      }
      media_type = "image";
    }
    if (video || animate_url) {
      const media = animate_url || video;
      if (media.split("//")[0] === "ipfs:") {
        const { url: videoUrl } = await getIpfsMedia(media.split("//")[1]);
        mediaUrl = videoUrl;
      } else {
        mediaUrl = media;
      }
      media_type = "video";
    }
  } catch (error) {
    error_code = "no_nfts_in_collection";
    error_message = "Individual metadata for this XLS20 NFT not found";
  }
  const details =
    uri.split("//")[0] === "ipfs:"
      ? await getIpfsJson(url)
      : await fetch(url).then((r) => r.json());

  return {
    tokenTaxon: NFTokenTaxon,
    issuer: Issuer,
    currency: NFTokenID,
    tokenName,
    url: mediaUrl,
    media_type,
    desc,
    issuerTruncated: truncate(Issuer),
    standard: "XLS-20",
    error_code,
    error_message,
  };
}

export async function fetchXls20(walletAddress: string): Promise<any> {
  const {
    result: { account_nfts },
  } = await getTokens(walletAddress);
  return account_nfts;
}

export async function fetchNextXls20(nextXls20: any[]): Promise<any> {
  try {
    const nextNfts = await Promise.all(
      nextXls20.map(async (nft: any) => {
        const one = await getOneXls(nft);
        return one;
      })
    );
    return nextNfts;
  } catch (error) {
    devlog(error);
  }
}
export async function fetchNextXls20WithSellOffer(
  nextXls20: any[],
  owner: string
): Promise<any> {
  const nextNfts = await Promise.all(
    nextXls20.map(async (nft: any) => {
      const { NFTokenID } = nft;
      const schema = await getOneXls(nft);
      const sellOffersResponse = await fetchSellOffers(NFTokenID);
      const buyOffersResponse = await fetchBuyOffers(NFTokenID);
      return {
        ...schema,
        selloffers:
          sellOffersResponse && sellOffersResponse.offers
            ? sellOffersResponse.offers.filter(
                (offer: any) => offer.owner == owner
              )
            : [],
        buyoffers:
          buyOffersResponse && buyOffersResponse.offers
            ? buyOffersResponse.offers
            : // .filter(
              //     (offer: any) => offer.owner == owner
              //   )
              [],
      };
    })
  );
  return nextNfts;
}
export async function cancelOffer({ TokenID, OfferID }: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecret);
  const tokenIDs = [OfferID];
  const transactionBlob = {
    TransactionType: "NFTokenCancelOffer",
    Account: wallet.classicAddress,
    TokenIDs: tokenIDs,
  };
  try {
    await client.submitAndWait(transactionBlob, { wallet });
    const sellOffer = await fetchSellOffers(TokenID);
    return sellOffer;
  } catch (error) {
    devlog(error);
  }
}
export async function cancelBuyOffer({ TokenID, OfferID }: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecret);
  const tokenIDs = [OfferID];
  const transactionBlob = {
    TransactionType: "NFTokenCancelOffer",
    Account: wallet.classicAddress,
    TokenIDs: tokenIDs,
  };
  try {
    await client.submitAndWait(transactionBlob, { wallet });
    const sellOffer = await fetchBuyOffers(TokenID);
    return sellOffer;
  } catch (error) {
    devlog(error);
  }
}
export async function acceptOffer({ OfferID }: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecretAlice);
  const transactionBlob = {
    TransactionType: "NFTokenAcceptOffer",
    Account: wallet.classicAddress,
    SellOffer: OfferID,
  };

  try {
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });
  } catch (error) {
    devlog(error);
  }
}
export async function acceptBuyOffer({ OfferID }: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecret);
  const transactionBlob = {
    TransactionType: "NFTokenAcceptOffer",
    Account: wallet.classicAddress,
    NFTokenBuyOffer: OfferID,
  };

  try {
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });
  } catch (error) {
    devlog(error);
  }
}
export async function createSellOffer({ TokenID, amount }: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecret);
  const transactionBlob = {
    TransactionType: "NFTokenCreateOffer",
    Account: wallet.classicAddress,
    TokenID: TokenID,
    Amount: (amount * 1000000).toString(),
    Flags: 1,
  };
  try {
    await client.submitAndWait(transactionBlob, {
      wallet,
    });
    const sellOffer = await fetchSellOffers(TokenID);
    return sellOffer;
  } catch (error) {
    devlog(error);
  }
}

export async function createBuyOffer({
  TokenID,
  Amount,
  Owner,
}: any): Promise<any> {
  const wallet = xrpl.Wallet.fromSeed(walletSecretAlice);
  const transactionBlob = {
    TransactionType: "NFTokenCreateOffer",
    Account: wallet.classicAddress,
    Owner,
    TokenID,
    Amount: (Amount * 1000000).toString(),
    Flags: 0,
  };
  try {
    await client.submitAndWait(transactionBlob, {
      wallet,
    });
    const buyOffer = await fetchBuyOffers(TokenID);
    return buyOffer;
  } catch (error) {
    devlog(error);
  }
}

export async function fetchNextSellOffers(nextXls20: any[]): Promise<any> {
  try {
    const sellOffers = await Promise.all(
      nextXls20.map(async (nft: any) => {
        const { URI, Issuer, NFTokenID } = nft;

        const one = await fetchSellOffers(NFTokenID);

        return one;
      })
    );
    return sellOffers.filter((a: any) => a);
  } catch (error) {
    devlog(error);
  }
}

export async function fetchSellOffers(TokenID: string): Promise<any> {
  try {
    const { result } = await client.request({
      method: "nft_sell_offers",
      nft_id: TokenID, //nft_id
    });
    return result;
  } catch (err) {
    devlog("No sell offers.");
  }
}

export async function fetchBuyOffers(TokenID: string): Promise<any> {
  try {
    const { result } = await client.request({
      method: "nft_buy_offers",
      nft_id: TokenID,
    });
    return result;
  } catch (err) {
    devlog("No buy offers.");
  }
}

// async function getIpfsMedia(url: string) {
//   return await checkFromIpfsList(url);
// }
async function getIpfsJson(url: string) {
  const ipfsGatewayList = [
    "https://ipfs.io/",
    "https://nftstorage.link/",
    "https://cloudflare-ipfs.com/",
  ].map((u) => u + "ipfs/" + url);
  const controller = new AbortController();
  const { signal } = controller;
  const pomises = ipfsGatewayList.map((u: string) =>
    fetch(u, { signal }).then((r) => r.json())
  );
  const result = await Promise.any(pomises);
  controller.abort();
  return result;
}
async function getIpfsMedia(url: string) {
  const ipfsGatewayList = [
    "https://dweb.link/",
    "https://cf-ipfs.com/",
    "https://gateway.ipfs.io/",
  ].map((u) => u + "ipfs/" + url);
  const controller = new AbortController();
  const { signal } = controller;
  const pomises = ipfsGatewayList.map((u: string) => fetch(u, { signal }));
  const result = await Promise.any(pomises);
  controller.abort();
  return result;
}

export async function init(network: string): Promise<any> {
  client = new xrpl.Client(network);

  // client.on("disconnected", async (msg: any) => {
  //   devlog("Disconnected");
  // });
  // client.on("connected", async (msg: any) => {
  //   devlog("Connected", client);
  // });
  // client.on("peerStatusChange", async (msg: any) => {
  //   devlog("peerStatusChange", msg);
  // });
  // client.on("ledgerClosed", async (msg: any) => {
  //   devlog("ledgerClosed", msg);
  // });
  // client.on("error", async (error: any) => {
  //   devlog("Connection Errors", error);
  // });

  await client.connect();
  return {
    connect,
    disconnect,
    client,
    fetchNftLines,
    fetchIssuerCurrencies,
    fetchOne,
    fetchNext,
    fetchXls20,
    fetchOneXls20,
  };
}
