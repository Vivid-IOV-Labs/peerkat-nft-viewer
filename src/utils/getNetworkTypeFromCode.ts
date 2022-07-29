//NFT-DEVNET : wss://xls20-sandbox.rippletest.net:51233
//HOOKS-TESTNET: wss://hooks-testnet-v2.xrpl-labs.com

interface urlMap {
  [id: string]: string[];
}
export function getNodeTypeFromNetwork(network: keyof urlMap) {
  const urlMap: urlMap = {
    /*test */
    "wss://s.altnet.rippletest.net:51233": ["https://test.bithomp.com/"],
    "wss://testnet.xrpl-labs.com": ["https://test.bithomp.com/"],
    /*main */
    "wss://s2.ripple.com": ["https://bithomp.com/"],
    "wss://xrpl.link": ["https://bithomp.com/"],
    "wss://xrplcluster.com": ["https://bithomp.com/"],
    /*custom */
    "wss://xls20-sandbox.rippletest.net:51233": ["https://xls20.bithomp.com/"],
    "wss://hooks-testnet-v2.xrpl-labs.com": ["https://hooks.bithomp.com/"],
  };
  return urlMap[network] ? urlMap[network][0] + issuer : "";
}

export function getNetworkTypeFromCode(code: number): string | undefined {
  if (code == 0) {
    return "MAINNET";
  }
  if (code == 1) {
    return "TESTNET";
  }
  if (code == 2) {
    return "DEVNET";
  }
  if (code == 3) {
    return "CUSTOM";
  }
  if (code == 4) {
    return "NFT-DEVNET";
  }
  if (code == 5) {
    return "HOOKS-TESTNET";
  }
}

export function getNetworkCodeFromType(type: string): number | undefined {
  if (type == "CUSTOM") {
    return 3;
  }
  if (type == "DEVNET") {
    return 2;
  }
  if (type == "TESTNET") {
    return 1;
  }
  if (type == "MAINNET") {
    return 0;
  }
  if (type == "NFT-DEVNET") {
    return 4;
  }
  if (type == "HOOKS-TESTNET") {
    return 5;
  }
}
