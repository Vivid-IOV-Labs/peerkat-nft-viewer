import { NFT } from "../../../models/NFT";
export interface NFTState {
  all: Array<NFT>;
  shared: Array<NFT>;
  lines: Array<NFT>;
}

const state = (): NFTState => ({
  all: [],
  shared: [],
  lines: [],
});

export default state;
