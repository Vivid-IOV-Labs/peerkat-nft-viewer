import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  TESTNET: Array<NFT>;
  MAINNET: Array<NFT>;
}
export interface NFTState {
  all: Array<NFT>;
  sharedwithme: SharedNFTs;
  lines: Array<NFT>;
  xrpClient: typeof XrplClient | null;
}

const state = (): NFTState => ({
  all: [],
  sharedwithme: { TESTNET: [], MAINNET: [] },
  lines: [],
  xrpClient: null,
});

export default state;
