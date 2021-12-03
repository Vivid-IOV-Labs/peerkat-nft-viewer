import { NFTState } from "./state";
interface NFT {
  cid: string;
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getByAddress:
    (state: NFTState) =>
    (address: string): NFT | undefined => {
      return state.all.find(({ issuer }) => issuer == address);
    },
};
