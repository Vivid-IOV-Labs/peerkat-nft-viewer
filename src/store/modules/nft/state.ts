import { NFT } from "../../../models/NFT";
export interface NFTState {
  all: Array<NFT>;
  lines: Array<any>;
}

const state = (): NFTState => ({
  all: [],
  lines: [],
});

export default state;
