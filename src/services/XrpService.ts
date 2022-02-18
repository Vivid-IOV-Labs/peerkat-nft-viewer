import { NFT } from "../models/NFT";
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
  "wss://xrpl.link",
  "wss://xrpcluster.com",

  "wss://s2.ripple.com",
];
const test_networks = [
  "wss://s.altnet.rippletest.net:51233",
  "wss://xrpl.linkwss://testnet.xrpl-labs.com",
];

let xrpClientInstance: any;

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
    return "xls-16";
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
  } else if (xlsProtocol == "xls-16") {
    const cid = source.split(":")[1];
    return "https://ipfs.io/ipfs/" + cid;
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

  const tokenName = getTokenName(currency);

  const xlsProtocol = getXLSProtocol(source);
  let url = getMediaByXLSProtocol(source, xlsProtocol, tokenName);

  let media_type = await getMediaType(url);

  if (media_type == "application/json") {
    const { image } = await fetch(url).then((res) => res.json());
    if (image) {
      url = getMediaByXLSProtocol(image, "xls-16");
      media_type = await getMediaType(url);
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
    limitFormatted,
  };
}
let client: any;

async function fetchNftLines(walletAddress: string): Promise<any> {
  await client.connect();

  const { result } = await client.request({
    command: "account_lines",
    account: walletAddress,
  });
  const { lines, error } = result;
  await client.disconnect();

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
  await client.connect();

  const { result } = await client.request({
    command: "account_info",
    account,
  });
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
    await client.disconnect();

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
  await client.connect();
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
  await client.disconnect();
  return nextNfts;
}

export function init(nodetype: string): any {
  const X_url = nodetype == "TESTNET" ? test_networks : main_networks;
  xrpClientInstance = new xrpl.Client(X_url[0]);
  client = xrpClientInstance;
  return {
    xrpClientInstance,
    fetchNftLines,
    fetchIssuerCurrencies,
    fetchOne,
    fetchNext,
  };
}
