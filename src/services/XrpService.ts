// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");

interface NFT {
  url: string;
  issuer: string;
  currency: string;
}
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
  frontChars = 8,
  backChars = 4
) {
  if (fullStr.length <= strLen) return fullStr;
  return (
    fullStr.substr(0, frontChars) + separator
    //+
    ///fullStr.substr(fullStr.length - backChars)
  );
}
export async function fetchWallet(
  walletAddress: string,
  network: string | string[],
  handleError: (error: string) => void
): Promise<NFT[]> {
  const X_url = network;
  const xrpClient = new XrplClient(X_url, {
    assumeOfflineAfterSeconds: 15,
    maxConnectionAttempts: 2,
    connectAttemptTimeoutSeconds: 3,
  });
  xrpClient.on("error", (error: string) => {
    handleError(error);
  });
  await xrpClient.ready();
  const accountLines = await xrpClient.send({
    command: "account_lines",
    account: walletAddress,
  });
  const { lines } = accountLines;
  const NFTs = lines.filter(isNFT);
  const NFTMedia: NFT[] = await Promise.all(
    NFTs.map(async (line: line) => {
      const { account, currency } = line;
      const { account_data } = await xrpClient.send({
        command: "account_info",
        account,
      });
      const { Domain } = account_data;

      const protocol = is_hexadecimal(hexToString(Domain))
        ? hexToString(hexToString(Domain))
        : hexToString(Domain);
      const domain = hexToString(currency.replace("02", ""));

      return {
        issuer: account,
        issuerTruncated: truncate(account),
        currency,
        url: protocol + domain,
      };
    })
  );
  return NFTMedia;
}
