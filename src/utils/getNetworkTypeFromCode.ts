export function getNetworkTypeFromCode(code: number): string | undefined {
  if (code == 0) {
    return "MAINNET";
  }
  if (code == 1) {
    return "TESTNET";
  }
}

export function getNetworkCodeFromType(type: string): number | undefined {
  if (type == "TESTNET") {
    return 1;
  }
  if (type == "MAINNET") {
    return 0;
  }
}
