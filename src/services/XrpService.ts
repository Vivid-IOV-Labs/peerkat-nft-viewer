import { NFT } from "../models/NFT";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");

type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
};
function isNFT(l: line): boolean {
  return (
    l.balance == "1000000000000000e-96" && l.limit == "1000000000000000e-96"
  );
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
  "wss://xrpcluster.com",
  "wss://xrpl.link",
  "wss://s2.ripple.com",
];
const test_networks = [
  "wss://s.altnet.rippletest.net:51233",
  "wss://xrpl.linkwss://testnet.xrpl-labs.com",
];

let xrpClientInstance: typeof XrplClient | null = null;

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
function getMediaByXLSProtocol(source: string, tokenName: string): string {
  const xlsProtocol = getXLSProtocol(source);
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
async function getOne(account_data: any, account: string, currency = "") {
  const { Domain } = account_data;
  const source = is_hexadecimal(hexToString(Domain))
    ? hexToString(hexToString(Domain))
    : hexToString(Domain);

  const tokenName = hexToString(currency.replace("02", ""));
  const url = getMediaByXLSProtocol(source, tokenName);
  const media_type = await getMediaType(url);
  return {
    issuer: account,
    issuerTruncated: truncate(account),
    currency,
    tokenName,
    url,
    media_type,
  };
}

let client: typeof XrplClient | null = null;

async function fetchNftLines(walletAddress: string): Promise<any> {
  try {
    const accountLines = await client.send({
      command: "account_lines",
      account: walletAddress,
    });
    const { lines } = accountLines;
    return lines.filter(isNFT);
  } catch (error) {
    console.log(error);
  }
}
async function fetchIssuerCurrencies(issuer: string): Promise<any> {
  try {
    const accountLines = await client.send({
      command: "account_currencies",
      account: issuer,
    });
    const { receive_currencies } = accountLines;
    return receive_currencies[0];
  } catch (error) {
    console.log(error);
  }
}
async function fetchOne(account: string, currency?: string): Promise<NFT> {
  const { account_data } = await client.send({
    command: "account_info",
    account,
  });
  if (currency) {
    return getOne(account_data, account, currency);
  } else {
    const issuerCurrency = await fetchIssuerCurrencies(account);
    return getOne(account_data, account, issuerCurrency);
  }
}
export async function init(
  nodetype: string,
  handleError: (error: unknown | Error | null) => void
): Promise<typeof XrplClient> {
  try {
    if (!client) {
      const X_url = nodetype == "TESTNET" ? test_networks : main_networks;
      xrpClientInstance = new XrplClient(
        X_url
        //   , {
        //   assumeOfflineAfterSeconds: 15,
        //   maxConnectionAttempts: 6,
        //   connectAttemptTimeoutSeconds: 3,
        // }
      );
      await xrpClientInstance.ready();

      // await client.ready();

      const serverInfo = await xrpClientInstance.send({
        command: "server_info",
      });
      console.log({ serverInfo });

      xrpClientInstance.on("error", (error) => {
        console.log("error", error);
      });
      client = xrpClientInstance;
    }
    return {
      fetchNftLines,
      fetchIssuerCurrencies,
      fetchOne,
    };
  } catch (error: unknown) {
    handleError(error);
  }
}
