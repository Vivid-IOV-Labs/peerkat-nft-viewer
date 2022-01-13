import { NFT } from "../models/NFT";
//https://dev.to/mindplay/a-successful-ioc-pattern-with-functions-in-typescript-2nac
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
  const res = await fetch(url);
  const contentType = res.headers.get("Content-Type");
  return contentType;
}
async function getOne(account_data: any, account: string, currency = "") {
  const { Domain } = account_data;

  const source = is_hexadecimal(hexToString(Domain))
    ? hexToString(hexToString(Domain))
    : hexToString(Domain);
  const token_domain = hexToString(currency.replace("02", ""));
  const cid = source.split(":")[1];

  const url = `https://ipfs.io/ipfs/${cid}`;

  const media_type = await getMediaType(url);
  return {
    issuer: account,
    issuerTruncated: truncate(account),
    currency,
    tokenName: token_domain,
    cid: cid,
    url,
    media_type,
  };
}

// export async function init(): Promise<typeof XrplClient> {
//   //handleError: (error: Error) => void
//   const X_url = test_networks;
//   xrpClientInstance = new XrplClient(X_url, {
//     assumeOfflineAfterSeconds: 15,
//     maxConnectionAttempts: 2,
//     connectAttemptTimeoutSeconds: 3,
//   });
//   await xrpClientInstance.ready();
//   client = xrpClientInstance;
//   return client;
// }

// export async function fetchWallet(
//   walletAddress: string //handleError: (error: Error | string) => void
// ): Promise<any> {
//   try {
//     const accountLines = await client.send({
//       command: "account_lines",
//       account: walletAddress,
//     });
//     localStorage.setItem("address", walletAddress);

//     const { lines } = accountLines;
//     const NFTs = lines.filter(isNFT);
//     const NFTMedia: NFT[] = await Promise.all(
//       NFTs.map(async (line: line) => {
//         const { account, currency } = line;
//         const { account_data } = await client.send({
//           command: "account_info",
//           account,
//         });
//         return getOne(account_data, account, currency);
//       })
//     );
//     return NFTMedia;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchNftLines(
//   walletAddress: string //handleError: (error: Error | string) => void
// ): Promise<any> {
//   try {
//     const accountLines = await client.send({
//       command: "account_lines",
//       account: walletAddress,
//     });
//     localStorage.setItem("address", walletAddress);

//     const { lines } = accountLines;
//     return lines.filter(isNFT);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchIssuerCurrencies(
//   issuer: string //handleError: (error: Error | string) => void
// ): Promise<any> {
//   try {
//     const accountLines = await client.send({
//       command: "account_currencies",
//       account: issuer,
//     });

//     const { result } = accountLines;
//     debugger;
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function fetchOne(
//   account: string,
//   currency: string
// ): Promise<NFT> {
//   const client: typeof XrplClient = await init();

//   const { account_data } = await client.send({
//     command: "account_info",
//     account,
//   });

//   return getOne(account_data, account, currency);
// }

export default (async () => {
  let client: typeof XrplClient | null = null;
  async function init(): Promise<typeof XrplClient> {
    //handleError: (error: Error) => void
    if (!client) {
      const X_url = test_networks;
      xrpClientInstance = new XrplClient(X_url, {
        assumeOfflineAfterSeconds: 15,
        maxConnectionAttempts: 2,
        connectAttemptTimeoutSeconds: 3,
      });
      await xrpClientInstance.ready();
      client = xrpClientInstance;
    }

    return client;
  }
  async function fetchWallet(
    walletAddress: string //handleError: (error: Error | string) => void
  ): Promise<any> {
    try {
      const accountLines = await client.send({
        command: "account_lines",
        account: walletAddress,
      });
      localStorage.setItem("address", walletAddress);

      const { lines } = accountLines;
      const NFTs = lines.filter(isNFT);
      const NFTMedia: NFT[] = await Promise.all(
        NFTs.map(async (line: line) => {
          const { account, currency } = line;
          const { account_data } = await client.send({
            command: "account_info",
            account,
          });
          return getOne(account_data, account, currency);
        })
      );
      return NFTMedia;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchNftLines(
    walletAddress: string //handleError: (error: Error | string) => void
  ): Promise<any> {
    try {
      const accountLines = await client.send({
        command: "account_lines",
        account: walletAddress,
      });
      localStorage.setItem("address", walletAddress);

      const { lines } = accountLines;
      return lines.filter(isNFT);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchIssuerCurrencies(
    issuer: string //handleError: (error: Error | string) => void
  ): Promise<any> {
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
    const client: typeof XrplClient = await init();

    const { account_data } = await client.send({
      command: "account_info",
      account,
    });
    if (currency) {
      debugger;
      return getOne(account_data, account, currency);
    } else {
      debugger;
      const issuerCurrency = await fetchIssuerCurrencies(account);
      return getOne(account_data, account, issuerCurrency);
    }
  }
  await init();
  return {
    fetchWallet,
    fetchNftLines,
    fetchIssuerCurrencies,
    fetchOne,
  };
})();
