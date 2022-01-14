import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  TESTNET: Array<NFT>;
  MAINNET: Array<NFT>;
}
export interface NFTState {
  all: Array<NFT>;
  shared: SharedNFTs;
  lines: Array<NFT>;
  xrpClient: null;
}

const state = (): NFTState => ({
  all: [],
  shared: { TESTNET: [], MAINNET: [] },
  lines: [],
  xrpClient: null,
});

export default state;
