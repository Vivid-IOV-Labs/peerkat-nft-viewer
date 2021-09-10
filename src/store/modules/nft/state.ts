import { NFT } from "../../../models/NFT";

export interface NFTState {
  all: Array<NFT>;
  totalItems: number;
  query: Record<string, string | number>;
}

const state = (): NFTState => ({
  all: [],
  totalItems: 0,
  query: {},
});

export default state;
