import axios from "axios";
import { format } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { NFT } from "../models/NFT";
import { delay } from "../utils/delay";
import { devlog } from "../utils/devlog";
import store from "../store/";
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
if (PDFJS && PDFJS.disableWorker) PDFJS.disableWorker = true;
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
  let url;
  let media_type;
  let desc;
  let author;
  let tokenName = "";
  let sololimitFormatted;
  let standard = "XLS-14";

  let error_code = "";
  let error_message = "";
  let error_title = "";
  if (Domain) {
    const source = is_hexadecimal(hexToString(Domain))
      ? hexToString(hexToString(Domain))
      : hexToString(Domain);
    const ctiHex = getCtiHex(currency);
    const ctiDecimal = hexToDec(ctiHex);
    const ctiDecimalString = ctiDecimal.toString();
    const ctiBigInt = BigInt(ctiDecimalString);
    const ledgerIndex = cti_ledger_index(ctiBigInt);
    const ledgerIndexDecimal = Number(ledgerIndex);
    const transactionIndex = cti_transaction_index(ctiBigInt);
    const transactionIndexDecimal = Number(transactionIndex);
    tokenName = getTokenName(currency);
    // eslint-disable-next-line no-inner-declarations
    async function geXls14() {
      const xlsProtocol = getXLSProtocol(source);

      if (xlsProtocol) {
        url = await getMediaByXLSProtocol(source, xlsProtocol, tokenName);
        media_type = await getMediaType(url);
        standard = "XLS-14";
        if (media_type == "application/json") {
          const { image } = await getIpfsJson(url);
          if (image) {
            url = await getMediaByXLSProtocol(image, "xls-16-peerkat");
            media_type = await getMediaType(url);
          }
        } else if (media_type?.includes("text/html")) {
          const metaUri = source.includes("hash:")
            ? source.split("hash:")[1]
            : source.split("ipfs/")[1];

          const { url: metadataUrl } = await getIpfsMedia(metaUri);

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
          // const { url: metadaNftUrl } = await getIpfsMedia(
          //   metadata.split("//")[1]
          // );
          const res = await getIpfsJson(metadata.split("//")[1]);
          desc = decodeHtmlEntity(res.description);
          tokenName = res.name;
          sololimitFormatted = collection.collection_item_count;
          const fil_ext = content_type.split("/")[1];
          // const { url: mediaUrl } = await getIpfsMedia(
          //   metadata.split("//")[1].replace("metadata.json", `data.${fil_ext}`)
          // );
          media_type = content_type;
          url = metadata
            .split("//")[1]
            .replace("metadata.json", `data.${fil_ext}`);
          //url = mediaUrl;
          standard = "XLS-14d/SOLO";
        } else {
          error_code = "no_nfts_in_collection";
          error_title = "XLS14/SOLO data currently unavailable [X03]";
          error_message =
            "This error may occur when the viewer is currently unable to access the individual asset file associated with this NFT. Please contact the Token Issuer and/or Sologenic for support. We will continue to upgrade the viewer, follow Peerkat via Twitter and Discord for updates and support.";
        }
      } catch (error: any) {
        error_code = "no_nfts_in_collection";
        error_title = "XLS14/SOLO data currently unavailable [X05]";
        error_message =
          "This error may occur when the viewer is currently unable to access the asset file associated with this NFT. We will continue to upgrade the viewer, follow Peerkat via Twitter and Discord for updates and support.";
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
        const mediaUri = uri.includes("hash:")
          ? uri.split(":")[1]
          : uri.split("//")[1];
        const res = await getIpfsMedia(mediaUri);

        url = res.url;
        media_type = await getMediaType(res.url);

        standard = "XLS-16";
      } else {
        devlog("No metadata");
        await geXls14();
      }
    } else {
      await geXls14();
    }
  } else {
    error_code = "no_nfts_in_collection";
    error_title = "XLS14/16 data currently unavailable [X04]";
    error_message =
      "This error may occur when the viewer is currently unable to access the URI for the asset file associated with this NFT. Please contact the Token Issuer for support. We will continue to upgrade the viewer, follow Peerkat via Twitter and Discord for updates and support.";
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
    error_title,
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
  NFTokenID: string,
  owner?: string
): Promise<any> {
  const {
    result: { account_nfts },
  } = await getTokens(walletAddress);
  const nftXLS20 = account_nfts.find((n: any) => {
    return n.NFTokenID == NFTokenID;
  });

  if (nftXLS20) {
    const schema = await getOneXls20(nftXLS20);
    const sellOffersResponse = await fetchSellOffers(NFTokenID);
    const buyOffersResponse = await fetchBuyOffers(NFTokenID);
    const now = Date.now();
    const buyoffers =
      buyOffersResponse && buyOffersResponse.offers
        ? buyOffersResponse.offers.filter((offer: any) => {
            if (offer.expiration) {
              return offer.expiration * 1000 > now;
            } else return true;
          })
        : [];
    return {
      ...schema,
      selloffers:
        sellOffersResponse && sellOffersResponse.offers
          ? sellOffersResponse.offers
          : // .filter(
            //     (offer: any) => offer.owner == owner
            //   )
            [],
      buyoffers,
    };
  } else {
    throw new Error("Not an XLS-20");
  }
}
async function getDomain(account: string) {
  const allReps = await client.request({
    command: "account_info",
    account,
  });
  const { result, error, error_code, error_message } = allReps;
  const { account_data } = result;
  const { Domain } = account_data;
  return hexToString(Domain);
}

export function createUrlFromDomain(domain: string, nftokenid: string) {
  if ("https://marketplace-api.onxrp.com/api/metadata/" === domain) {
    return `${domain}${nftokenid}.json`;
  } else if (domain.includes("ipfs")) {
    return `${domain.split("//")[1]}${nftokenid}.json`;
  } else {
    const d = domain.slice(-1) == "/" ? domain.slice(0, -1) : domain;
    return `${d}/.well-known/xrpl-nft/${nftokenid}`;
  }
}

export function createUrlFromURI(uri: string) {
  // const uri = hexToString(URI); //.replace(/\\/g, "");
  // const end = uri.includes(".json")
  //   ? ""
  //   : Number.isInteger(NFTokenTaxon)
  //   ? `/${NFTokenTaxon}.json`
  //   : "/base.json";

  const url = uri.includes("ipfs:")
    ? uri.split("//")[1]
    : uri.includes("/ipfs/")
    ? uri.split("/ipfs/")[1]
    : uri.includes("cid:")
    ? uri.split("cid:")[1]
    : uri;
  return url;
}

export async function logFailedToLoad(obj: any): Promise<any> {
  const lambdaUrl = `/logger`;
  try {
    await fetch(lambdaUrl, {
      method: "POST",
      //mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then((r) => r.json());
  } catch (err) {
    devlog("logFailedToLoad", err);
  }
}

async function getXLS20ContentType(
  mediaUrl: string,
  NFTokenID: string,
  type: string,
  isThumbnail: boolean
): Promise<any> {
  const ext = mediaUrl && mediaUrl.split(".")?.pop()?.toLowerCase();

  if (ext && ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
    return "image/" + ext;
  } else if (ext && ["mp4", "mpeg", "ogv", "webm"].includes(ext)) {
    return "video/" + ext;
  } else {
    try {
      const end =
        type === "image"
          ? `full/${type}`
          : type === "image" && isThumbnail
          ? `200px/${type}`
          : type;
      const url = `/apidev/assets/${type}s/${NFTokenID}/${end}`;
      const isReturned = await fetch(url, { method: "HEAD" });
      if (isReturned.ok && isReturned.status === 200) {
        return isReturned.headers.get("Content-Type");
      } else {
        throw new Error("Error Status:" + isReturned.status);
      }
    } catch (err) {
      const response = await getIpfsMedia(mediaUrl);
      return response && response.headers
        ? response.headers.get("Content-Type")
        : null;
    }
  }
}

function getXLS20MediaUrl(mediaUrl: string): string {
  if (mediaUrl.split("//")[0].includes("ipfs:") || !mediaUrl.split("//")[0]) {
    return encodeURI(mediaUrl.split("//")[1].replace("ipfs/", ""));
  } else if (mediaUrl.includes("/ipfs/")) {
    return encodeURI(mediaUrl.split("/ipfs/")[1]);
  } else {
    return encodeURI(mediaUrl);
  }
}

export async function getOneXls20(nft: any) {
  interface Assets {
    image?: any | null;
    video?: any | null;
    aufio?: any | null;
    animation?: any | null;
    file?: any | null;
  }
  let mediaUrl;
  let media_type;
  let error_code;
  let error_message;
  let error_title;
  let tokenName;
  let description;
  let attributes;
  let collection;
  let thumbnail;
  let thumbnailType;
  let details;
  let domain;
  let type;
  const assets: Assets = {
    image: undefined,
    video: undefined,
    aufio: undefined,
    animation: undefined,
    file: undefined,
  };
  const { Issuer, NFTokenID, URI, NFTokenTaxon, nft_serial } = nft;
  const nodetype = store.getters["user/getNodeType"];

  try {
    if (nodetype !== "MAINNET") {
      throw new Error("not mainnet");
    }
    const url = `/apidev/assets/metadata/${NFTokenID}/metadata.json`;
    details = await fetch(url).then((r) => r.json());
  } catch (err) {
    if (!URI) {
      domain = await getDomain(Issuer);

      if (nodetype === "MAINNET") {
        const t = await logFailedToLoad({
          Issuer,
          NFTokenID,
          Domain: domain,
          NFTokenTaxon,
          nft_serial,
          Source: "xummapp-frontend",
        });
      }

      const url = createUrlFromDomain(domain, NFTokenID);
      try {
        if (domain.includes("https")) {
          details = await fetch(url).then((r) => r.json());
          if (details.code && details.code == 404) {
            throw new Error();
          }
        } else {
          details = await getIpfsJson(url);
        }
      } catch (error) {
        devlog(error);
        error_code = "no_nfts_in_collection";
        error_title = "Data currently unavailable  [X02]";
        error_message =
          "This error may occur when the viewer is currently unable to fetch metadata from the URI. This error occurs when the viewer is not familiar with the URI approach. Please contact the Token Issuer for support. We will continue to upgrade the viewer, follow Peerkat via Twitter and Discord for updates and support.";
      }
    } else {
      const t = await logFailedToLoad({
        Issuer,
        NFTokenID,
        URI,
        NFTokenTaxon,
        Source: "xummapp-frontend",
      });
      const uri = hexToString(URI); //.replace(/\\/g, "");
      const url = createUrlFromURI(uri);

      try {
        const response =
          uri.includes("ipfs:") ||
          uri.includes("/ipfs/") ||
          !uri.includes("//") ||
          uri.includes("cid:")
            ? await getIpfsJson(url)
            : await fetch(url);
        if (response.headers) {
          const contentType = response.headers.get("Content-Type");
          if (
            contentType?.includes("image") ||
            contentType?.includes("video")
          ) {
            const ipfLinkUrlPattern = new RegExp(
              "https://([a-zA-Z]+([0-9]+[a-zA-Z]+)+).ipfs.[A-Za-z0-9]+.[A-Za-z0-9]+/([A-Za-z0-9]+(_[A-Za-z0-9]+)+).[A-Za-z0-9]+"
            ).test(url);
            if (ipfLinkUrlPattern) {
              const ipfsHash = url.split(".ipfs")[0].split("//")[1];
              const name = url.split(".ipfs")[1].split("/")[1];
              thumbnail = ipfsHash + "/" + name;
              media_type = contentType;
              mediaUrl = ipfsHash + "/" + name;
            }
          } else {
            details = await response.json();
          }
        } else {
          details = response;
        }
      } catch (error) {
        devlog("no_nfts_in_collection", error);
        error_code = "no_nfts_in_collection";
        error_title = "Data currently unavailable  [X01]";
        error_message =
          "This error may occur when the viewer attempts to fetch metadata from the URI and the network request times out. This error occurs most frequently when using a public IPFS link. Please try again by quitting the xApp and reload. We will continue to upgrade the viewer, follow Peerkat via Twitter and Discord for updates and support.";
      }
    }
  }
  if (details) {
    details = details.metadata ? details.metadata : details;

    tokenName = details.name && details.name.replace(/[^\w\s]/gi, "");
    description = details.description;
    attributes = details.attributes;

    collection = details.collection;
    if (details.content) {
      const cid = details.content.split("cid:")[1];
      const response = await getIpfsMedia(cid);
      const contentType = response.headers.get("Content-Type");
      media_type = contentType;
      mediaUrl = response.url;
      thumbnail = response.url;
      thumbnailType = contentType;
    }
    if (details.thumbnail) {
      thumbnail = getXLS20MediaUrl(details.thumbnail);
      thumbnailType = await getXLS20ContentType(
        details.thumbnail,
        NFTokenID,
        "image",
        true
      );
    }
    if (details.image || details.image_url) {
      const media = details.image || details.image_url;
      mediaUrl = getXLS20MediaUrl(media);
      const type = "image";
      media_type = await getXLS20ContentType(mediaUrl, NFTokenID, type, false);
      thumbnail = details.thumbnail || mediaUrl;
      thumbnailType = await getXLS20ContentType(
        thumbnail,
        NFTokenID,
        type,
        false
      );
      assets.image = {
        media_type,
        mediaUrl,
      };
    }

    if (details.animation || details.animation_url) {
      const media = details.animation || details.animation_url;
      mediaUrl = getXLS20MediaUrl(media);
      const type = "animation";
      media_type = await getXLS20ContentType(mediaUrl, NFTokenID, type, true);
      if (
        (details.content_type && details.content_type.includes("video")) ||
        media_type.includes("video")
      ) {
        if (details.image || details.image_url) {
          const poster = details.image || details.image_url;
          thumbnail = getXLS20MediaUrl(poster);
          thumbnailType = await getXLS20ContentType(
            thumbnail,
            NFTokenID,
            "image",
            true
          );
        } else {
          thumbnail = details.thumbnail || mediaUrl;
          thumbnailType = media_type;
        }
      } else {
        if (details.image || details.image_url) {
          const poster = details.image || details.image_url;
          thumbnail = getXLS20MediaUrl(poster);
          thumbnailType = await getXLS20ContentType(
            thumbnail,
            NFTokenID,
            "image",
            false
          );
        } else {
          thumbnail = details.thumbnail || mediaUrl;
          thumbnailType = media_type;
        }
      }
      assets.animation = {
        media_type,
        mediaUrl,
      };
    }

    if (details.video) {
      const media = details.animation_url || details.video;
      if (media.split("//")[0] === "ipfs:") {
        mediaUrl = media.split("//")[1];
      } else {
        mediaUrl = media;
      }
      media_type = await getXLS20ContentType(
        mediaUrl,
        NFTokenID,
        "video",
        false
      );
      if (details.image || details.image_url) {
        const poster = details.image || details.image_url;
        const posterUrl = getXLS20MediaUrl(poster);
        thumbnail = posterUrl;
        thumbnailType = await getXLS20ContentType(
          thumbnail,
          NFTokenID,
          "image",
          true
        );
      } else {
        thumbnail = details.thumbnail || mediaUrl;
        thumbnailType = media_type;
      }
      assets.video = {
        media_type,
        mediaUrl,
      };
    }
    type =
      details.animation_url || details.animation
        ? "animation"
        : details.video
        ? "video"
        : "image";
  }

  if (!domain && !URI) {
    domain = await getDomain(Issuer);
  }
  return {
    tokenTaxon: NFTokenTaxon,
    issuer: Issuer,
    currency: NFTokenID,
    tokenName,
    url: mediaUrl,
    media_type,
    thumbnailType,
    type,
    desc: description,
    issuerTruncated: truncate(Issuer),
    standard: "XLS-20",
    error_code,
    error_message,
    error_title,
    attributes,
    collection,
    thumbnail: thumbnail,
    nft_serial: nft.nft_serial,
    URI,
    Domain: domain,
    assets,
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
        const one = await getOneXls20(nft);
        return one;
      })
    );
    return nextNfts;
  } catch (error) {
    devlog("fetchNextXls20 Error", error);
  }
}
export async function fetchNextXls20WithSellOffer(
  nextXls20: any[],
  owner: string
): Promise<any> {
  const nextNfts = await Promise.all(
    nextXls20.map(async (nft: any) => {
      const { NFTokenID } = nft;
      const schema = await getOneXls20(nft);
      const sellOffersResponse = await fetchSellOffers(NFTokenID);
      const buyOffersResponse = await fetchBuyOffers(NFTokenID);
      const now = Date.now();
      const buyoffers =
        buyOffersResponse && buyOffersResponse.offers
          ? buyOffersResponse.offers.filter((offer: any) => {
              if (offer.expiration) {
                return offer.expiration * 1000 > now;
              } else return true;
            })
          : [];
      return {
        ...schema,
        selloffers:
          sellOffersResponse && sellOffersResponse.offers
            ? sellOffersResponse.offers.filter(
                (offer: any) => offer.owner == owner
              )
            : [],
        buyoffers,
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
    devlog("cancelOffer", error);
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
    devlog("cancelBuyOffer Error", error);
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
    // devlog("No sell offers.");
  }
}

// import { enUS } from "date-fns/locale";
// import { format } from "date-fns";
// const now = Date.now();
export async function fetchBuyOffers(TokenID: string): Promise<any> {
  try {
    const { result } = await client.request({
      method: "nft_buy_offers",
      nft_id: TokenID,
    });

    return result;
  } catch (err) {
    // devlog("No buy offers.");
  }
}

// async function getIpfsMedia(url: string) {
//   return await checkFromIpfsList(url);
// }
interface list {
  [name: string]: any | undefined;
}
const ipfsGatewayLisWithObfuscateTime: any[] = [
  { domain: "https://dweb.link/ipfs/", obfuscateTime: null },
  { domain: "https://nftstorage.link/ipfs/", obfuscateTime: null },
  {
    domain: "https://ipfs.io/ipfs/",
    obfuscateTime: null,
  },
  {
    domain: "https://ipfs.eth.aragon.network/ipfs/",
    obfuscateTime: null,
  },
  { domain: "https://gateway.ipfs.io/ipfs/", obfuscateTime: null },
];

function initIpfsGatewayLisWithObfuscateTime() {
  //if (!getIpfsGatewayLisWithObfuscateTime()) {
  localStorage.setItem(
    "ipfsGatewayLisWithObfuscateTime",
    JSON.stringify(ipfsGatewayLisWithObfuscateTime)
  );
  //}
}
function setIpfsGatewayLisWithObfuscateTime(newList: any) {
  localStorage.setItem(
    "ipfsGatewayLisWithObfuscateTime",
    JSON.stringify(newList)
  );
}
function getIpfsGatewayLisWithObfuscateTime() {
  const item = localStorage.getItem("ipfsGatewayLisWithObfuscateTime");
  return item ? JSON.parse(item) : null;
}
function getAvailableIpfsGateway() {
  const oneMinuteAgo = new Date(Date.now() - 1000 * 4);
  const availableIpfsGateway = getIpfsGatewayLisWithObfuscateTime().filter(
    ({ obfuscateTime }: any) => {
      return (
        obfuscateTime == null ||
        (obfuscateTime && obfuscateTime <= oneMinuteAgo)
      );
    }
  );
  return availableIpfsGateway.slice(0, 3);
}
function obfuscateIpfsFromList(domain: string) {
  const list = getIpfsGatewayLisWithObfuscateTime();
  const ipfs = list.find((ipfs: any) => ipfs.domain == domain);
  if (ipfs) {
    ipfs.obfuscateTime = Date.now();
  }
  setIpfsGatewayLisWithObfuscateTime(list);
}
async function recursiveIpfsFetch(url: string): Promise<any> {
  // return the promise
  const controller = new AbortController();
  const signal = controller.signal;
  const availableIpfsGateway = getAvailableIpfsGateway();
  if (availableIpfsGateway.length) {
    const pomises = availableIpfsGateway.map((u: any) =>
      fetch(u.domain + url, {
        signal,
        cache: "force-cache",
        mode: "cors",
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error! status: ${response.url} ${response.status}`);
        }
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("image") || contentType?.includes("video")) {
          // const blob = await response.blob();
          // const mediaUrl = URL.createObjectURL(blob);
          return contentType?.includes("image")
            ? { image: response.url }
            : { video: response.url };
        } else {
          const json = await response.json();
          return json;
        }
      })
    );
    try {
      // const dealytensec = delay(1000).then(() => {
      //   return "not loaded";
      // });
      const res = await Promise.race(pomises);
      // if (res == "not loaded") {
      //   availableIpfsGateway.array.forEach(async (ipfs: any) => {
      //     obfuscateIpfsFromList(ipfs.domain);
      //     controller.abort();
      //     return await recursiveIpfsFetch(url);
      //   });
      //   controller.abort();
      // }
      controller.abort();
      return res;
    } catch (error: any) {
      const errorCodesInMessage = ["429", "504", "408", "524", "403"].some(
        (el) => error.message.includes(el)
      );
      if (availableIpfsGateway.length) {
        const ipfs = availableIpfsGateway.find((i: any) => {
          return error.message.includes(i.domain.replace("https://", ""));
        });
        if (
          (errorCodesInMessage && ipfs) ||
          (ipfs &&
            ["https://cf-ipfs.com/", "https://cloudflare-ipfs.com/"].includes(
              ipfs.domain
            ))
        ) {
          obfuscateIpfsFromList(ipfs.domain);
          controller.abort();
          return await recursiveIpfsFetch(url);
        } else {
          controller.abort();
          throw new Error(error);
        }
      } else {
        controller.abort();
        throw new Error(error);
      }
    }
  } else {
    throw new Error("No Ipfs");
  }
}
async function getIpfsJson(url: string) {
  const result = await recursiveIpfsFetch(url);
  return result;
}
// async function recursiveIpfsFetchMedia(url: string): Promise<any> {
//   // return the promise
//   const controller = new AbortController();
//   const signal = controller.signal;
//   const availableIpfsGateway = getAvailableIpfsGateway();
//   if (availableIpfsGateway.length) {
//     const pomises = availableIpfsGateway.map((u: any) =>
//       fetch(u.domain + "ipfs/" + url, {
//         cache: "force-cache",
//         method: "HEAD",
//       }).then(async (response) => {
//         if (!response.ok) {
//           throw new Error(`Error! status: ${response.url} ${response.status}`);
//         }
//         const result = response.json();
//         return result;
//       })
//     );
//     try {
//       const res = await Promise.race(pomises);
//       controller.abort();
//       return res;
//     } catch (error: any) {
//       const errorCodesInMessage = ["429", "504", "408", "524", "403"].some(
//         (el) => error.message.includes(el)
//       );
//       if (availableIpfsGateway.length) {
//         const ipfs = availableIpfsGateway.find((i: any) => {
//           return error.message.includes(i.domain.replace("https://", ""));
//         });
//         if (
//           (errorCodesInMessage && ipfs) ||
//           ["https://cf-ipfs.com/", "https://cloudflare-ipfs.com/"].includes(
//             ipfs.domain
//           )
//         ) {
//           obfuscateIpfsFromList(ipfs.domain);
//           controller.abort();
//           return await recursiveIpfsFetch(url);
//         } else {
//           controller.abort();
//           throw new Error("Unable to fetch NFT metadata from the link");
//         }
//       } else {
//         controller.abort();
//         throw new Error("Unable to fetch NFT metadata from the link");
//       }
//     }
//   } else {
//     devlog("Unable to fetch NFT metadata from the link");
//     throw new Error("Unable to fetch NFT metadata from the link");
//   }
// }
export async function getIpfsMedia(url: string): Promise<any> {
  if (url.includes("https")) {
    const response = await fetch(url, { cache: "force-cache", method: "HEAD" });
    return response;
  } else {
    const ipfsGatewayList = [
      "https://cloudflare-ipfs.com/ipfs/",
      "https://cf-ipfs.com/ipfs/",
      "https://ipfs.io/ipfs/",
      // "https://nftstorage.link/ipfs/",
      // "https://jorropo.net/ipfs/",
    ].map((u) => u + url);
    const controller = new AbortController();
    const signal = controller.signal;
    const pomises = ipfsGatewayList.map((u: string) =>
      fetch(u, { signal, cache: "force-cache", method: "HEAD" })
    );
    const result = await Promise.any(pomises);
    controller.abort();
    return result;
  }
}

export async function init(network: string): Promise<any> {
  client = new xrpl.Client(network);
  initIpfsGatewayLisWithObfuscateTime();
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
