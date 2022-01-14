export function getNetworkTypeFromCode(code: number): string {
  return code == 1 ? "MAINNET" : "TESTNET";
}

export function getNetworkCodeFromType(type: string): number {
  return type == "TESTNET" ? 0 : 1;
}
