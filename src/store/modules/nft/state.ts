import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  testent: Array<NFT>;
  mainnet: Array<NFT>;
}
export interface NFTState {
  all: Array<NFT>;
  shared: SharedNFTs;
  lines: Array<NFT>;
}

const state = (): NFTState => ({
  all: [],
  shared: { testent: [], mainnet: [] },
  lines: [],
});

export default state;
