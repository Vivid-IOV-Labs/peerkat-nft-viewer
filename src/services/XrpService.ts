import { NFT } from "../models/NFT";
import { devlog } from "../utils/devlog";
const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;

const xrpl = (window as any).xrpl;
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
  balanceFormatted: string;
  limitFormatted: string;
};
function isNFT({ balance, limit }: line): boolean {
  const isNFTRegex = /^(\d{16})(e-)(85|86|87|89|90|91|92|93|94|95|96)$/;
  return isNFTRegex.test(balance) && isNFTRegex.test(limit);
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
const main_networks = [
  "wss://s2.ripple.com",
  "wss://xrpl.link",
  "wss://xrpcluster.com",
];
const test_networks = [
  "wss://s.altnet.rippletest.net:51233",
  "wss://xrpl.linkwss://testnet.xrpl-labs.com",
];

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
  if (/(http|https|ipfs)?:\/\//.test(source)) {
    return "xls-14";
  } else if (/(hash)?:/.test(source)) {
    return "xls-16-peerkat";
  } else {
    return "";
  }
}
function getMediaByXLSProtocol(
  source: string,
  xlsProtocol: string,
  tokenName?: string
): string {
  if (xlsProtocol == "xls-14") {
    const protocol = source.split("//")[0];
    return protocol + "//" + tokenName;
  } else if (xlsProtocol == "xls-16-peerkat") {
    const cid = source.split(":")[1];
    return ipfsGateway + "/" + cid;
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
    return hexToString(removeFirst02.substring(14));
  } else {
    return hexToString(removeFirst02);
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
  let tokenName;
  let sololimitFormatted;
  const ctiHex = getCtiHex(currency);
  const ctiDecimal = hexToDec(ctiHex);
  const ctiDecimalString = ctiDecimal.toString();
  const ctiBigInt = BigInt(ctiDecimalString);

  //const isValidCti = cti_is_simple(ctiBigInt);
  // const isValidCtiLedger = cti_ledger_check(ctiBigInt);
  // const isValidCtiTransaction = cti_transaction_check(ctiBigInt);

  const ledgerIndex = cti_ledger_index(ctiBigInt);
  const ledgerIndexDecimal = Number(ledgerIndex);

  const transactionIndex = cti_transaction_index(ctiBigInt);
  const transactionIndexDecimal = Number(transactionIndex);

  tokenName = getTokenName(currency);
  if (isXls14Solo(currency)) {
    const metadataUrl = ipfsGateway + "/" + source.split("//")[1];
    try {
      const collection = await fetch(metadataUrl).then((res) => res.json());
      const { nfts } = collection;
      const nft = nfts.find((n: any) => n.currency == currency);
      const { content_type, metadata } = nft;
      const metadaNftUrl = ipfsGateway + "/" + metadata.split("//")[1];
      const res = await fetch(metadaNftUrl).then((res) => res.json());
      desc = res.description;
      tokenName = res.name;
      sololimitFormatted = res.collection_item_count;
      const fil_ext = content_type.split("/")[1];
      const mediaUrl = metadaNftUrl.replace("metadata.json", `data.${fil_ext}`);
      media_type = content_type;
      url = mediaUrl;
    } catch (error) {
      devlog(error);
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
      desc = metadata
        .find((m: any) => m.type == "Description")
        .data.replace("â", "")
        .replace("Â", "");
      author = metadata.find((m: any) => m.type == "Author").data;
      url = ipfsGateway + "/" + uri.split("//")[1];
      media_type = await getMediaType(url);
    } else {
      devlog("no metadata");
    }
  } else {
    const xlsProtocol = getXLSProtocol(source);
    url = getMediaByXLSProtocol(source, xlsProtocol, tokenName);
    media_type = await getMediaType(url);
    if (media_type == "application/json") {
      const { image } = await fetch(url).then((res) => res.json());
      if (image) {
        url = getMediaByXLSProtocol(image, "xls-16-peerkat");
        media_type = await getMediaType(url);
      }
    }
  }

  return {
    issuer: account,
    issuerTruncated: truncate(account),
    currency,
    tokenName,
    url,
    media_type,
    balanceFormatted,
    limitFormatted: sololimitFormatted ? sololimitFormatted : limitFormatted,
    desc,
    author,
  };
}
let client: any;

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

async function fetchNftLines(walletAddress: string): Promise<any> {
  try {
    const { result } = await client.request({
      command: "account_lines",
      account: walletAddress,
    });
    const { lines, error } = result;
    if (error) {
      throw new Error(error);
    } else {
      return lines.filter(isNFT).map(function (line: line) {
        return {
          ...line,
          balanceFormatted: formatXrpCurrency(line.balance),
          limitFormatted: formatXrpCurrency(line.limit),
        };
      });
    }
  } catch (error) {
    devlog("fetchNftLines Error ", error);
  }
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
    return getOne(
      account_data,
      account,
      currency,
      balanceFormatted,
      limitFormatted
    );
  } else {
    const issuerCurrency = await fetchIssuerCurrencies(account);

    return getOne(
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

export async function init(nodetype: string): Promise<any> {
  const X_url = nodetype == "TESTNET" ? test_networks : main_networks;
  client = new xrpl.Client(X_url[0], { connectionTimeout: 2000 });

  // client.on("disconnected", async (msg: any) => {
  //   devlog("Disconnected", msg);
  // });
  // client.on("connected", async (msg: any) => {
  //   devlog("Connected", msg);
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
  };
}
