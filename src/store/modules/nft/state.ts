import { NFT } from "../../../models/NFT";
export interface NFTState {
  all: Array<NFT>;
}

const state = (): NFTState => ({
  all: [],
});

export default state;
