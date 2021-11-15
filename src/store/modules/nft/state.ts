interface NFT {
  url: string;
  issuer: string;
  currency: string;
}
export interface NFTState {
  all: Array<NFT>;
}

const state = (): NFTState => ({
  all: [],
});

export default state;
