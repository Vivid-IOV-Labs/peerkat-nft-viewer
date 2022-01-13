export function getNetworkTypeFromCode(code: number): string {
  return code == 1 ? "mainnet" : "testnet";
}

export function getNetworkCodeFromType(type: string): number {
  return type == "TESTNET" ? 0 : 1;
}
