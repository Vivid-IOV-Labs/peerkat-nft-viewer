// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");

// interface NFT {
//   url: string;
//   issuer: string;
//   currency: string;
// }
// type line = {
//   balance: string;
//   limit: string;
//   account: string;
//   currency: string;
// };
// function isNFT(l: line): boolean {
//   return (
//     l.balance == "1000000000000000e-96" && l.limit == "1000000000000000e-96"
//   );
// }
// function is_hexadecimal(str: string): boolean {
//   const regexp = /^[0-9a-fA-F]+$/;
//   if (regexp.test(str)) {
//     return true;
//   } else {
//     return false;
//   }
// }
// function hexToString(hex: string) {
//   const strhex = hex.toString(); //force conversion
//   let str = "";
//   for (let i = 0; i < strhex.length; i += 2)
//     str += String.fromCharCode(parseInt(strhex.substr(i, 2), 16));
//   return str.trim();
// }
// function truncate(
//   fullStr: string,
//   strLen = 8,
//   separator = " ............. ",
//   frontChars = 8,
//   backChars = 4
// ) {
//   if (fullStr.length <= strLen) return fullStr;
//   return (
//     fullStr.substr(0, frontChars) + separator
//     //+
//     ///fullStr.substr(fullStr.length - backChars)
//   );
// }
// export async function fetchWallet(
//   walletAddress: string,
//   network: string | string[],
//   handleError: (error: string) => void
// ): Promise<NFT[]> {
//   const X_url = network;
//   const xrpClient = new XrplClient(X_url, {
//     assumeOfflineAfterSeconds: 15,
//     maxConnectionAttempts: 2,
//     connectAttemptTimeoutSeconds: 3,
//   });
//   xrpClient.on("error", (error: string) => {
//     handleError(error);
//   });
//   await xrpClient.ready();
//   const accountLines = await xrpClient.send({
//     command: "account_lines",
//     account: walletAddress,
//   });
//   const { lines } = accountLines;
//   const NFTs = lines.filter(isNFT);
//   const NFTMedia: NFT[] = await Promise.all(
//     NFTs.map(async (line: line) => {
//       const { account, currency } = line;
//       const { account_data } = await xrpClient.send({
//         command: "account_info",
//         account,
//       });
//       const { Domain } = account_data;

//       const protocol = is_hexadecimal(hexToString(Domain))
//         ? hexToString(hexToString(Domain))
//         : hexToString(Domain);
//       const domain = hexToString(currency.replace("02", ""));

//       return {
//         issuer: account,
//         issuerTruncated: truncate(account),
//         currency,
//         tokenName: domain,
//         url: protocol + domain,
//       };
//     })
//   );
//   return NFTMedia;
// }
// import { XrplClient } from "xrpl-client";

interface NFT {
  cid: string;
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
  frontChars = 8
  // backChars = 4
) {
  if (fullStr.length <= strLen) return fullStr;
  return (
    fullStr.substr(0, frontChars) + separator
    //+
    ///fullStr.substr(fullStr.length - backChars)
  );
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

// export async function init(
//   network: string | string[],
//   handleError: (error: string) => void
// ): Promise<XrplClient> {
//   const X_url = network;
//   xrpClientInstance = new XrplClient(X_url, {
//     assumeOfflineAfterSeconds: 15,
//     maxConnectionAttempts: 2,
//     connectAttemptTimeoutSeconds: 3,
//   });
//   xrpClientInstance.on("error", (error) =>
//     handleError(error as unknown as string)
//   );
//   await xrpClientInstance.ready();
//   return xrpClientInstance;
// }

export async function init(): Promise<typeof XrplClient> {
  //handleError: (error: Error) => void
  const X_url = test_networks;
  xrpClientInstance = new XrplClient(X_url, {
    assumeOfflineAfterSeconds: 15,
    maxConnectionAttempts: 2,
    connectAttemptTimeoutSeconds: 3,
  });
  await xrpClientInstance.ready();
  return xrpClientInstance;
}

export async function fetchWallet(
  walletAddress: string //handleError: (error: Error | string) => void
): Promise<any> {
  // debugger;
  const client = await init();
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

export async function fetchNftLines(
  walletAddress: string //handleError: (error: Error | string) => void
): Promise<any> {
  // debugger;
  const client = await init();
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

export async function fetchOne(
  account: string,
  currency: string
): Promise<NFT> {
  const client: typeof XrplClient = await init();

  const { account_data } = await client.send({
    command: "account_info",
    account,
  });

  return getOne(account_data, account, currency);
}
function getOne(account_data: any, account: string, currency = "") {
  const { Domain } = account_data;

  const source = is_hexadecimal(hexToString(Domain))
    ? hexToString(hexToString(Domain))
    : hexToString(Domain);
  const token_domain = hexToString(currency.replace("02", ""));
  const cid = source.split(":")[1];

  return {
    issuer: account,
    issuerTruncated: truncate(account),
    currency,
    tokenName: token_domain,
    cid: cid,
  };
}

// const Singleton = (function () {
//   var xrpClientInstance;

//   function createInstance() {
//       var classObj = new Username();
//       return classObj;
//   }

//   return {
//       getInstance: function () {
//           if (!instance) {
//               instance = createInstance();
//           }
//           return instance;
//       },
//   };
// })();
