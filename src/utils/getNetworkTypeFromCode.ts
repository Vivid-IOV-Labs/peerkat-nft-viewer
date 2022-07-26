//NFT-DEVNET : wss://xls20-sandbox.rippletest.net:51233
//HOOKS-TESTNET: wss://hooks-testnet-v2.xrpl-labs.com

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
}
