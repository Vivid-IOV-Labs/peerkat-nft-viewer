import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  TESTNET: Array<NFT>;
  MAINNET: Array<NFT>;
}
export interface SharedNFTsByWallet {
  [walletaddress: string]: SharedNFTs;
}
export interface NFTState {
  all: Array<NFT>;
  sharedwithme: SharedNFTs;
  lines: Array<NFT>;
  xrpClient: typeof XrplClient | null;
  isConnected: boolean;
}

const state = (): NFTState => ({
  all: [],
  sharedwithme: { TESTNET: [], MAINNET: [] },
  lines: [],
  xrpClient: null,
  isConnected: false,
});

export default state;
