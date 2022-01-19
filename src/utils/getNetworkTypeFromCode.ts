export function getNetworkTypeFromCode(code: number): string {
  return code == 0 ? "MAINNET" : "TESTNET";
}

export function getNetworkCodeFromType(type: string): number {
  return type == "TESTNET" ? 1 : 0;
}
