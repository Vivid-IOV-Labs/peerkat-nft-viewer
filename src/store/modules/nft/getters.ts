import { NFTState, SharedNFTs } from "./state";
interface NFT {
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getShared:
    (state: NFTState) =>
    (nodetype: keyof SharedNFTs): Array<NFT> => {
      console.log(state.shared, nodetype);
      console.log(state.shared[nodetype]);
      return state.shared[nodetype];
    },
  getLines: (state: NFTState): Array<NFT> => state.lines,
  getByAddress:
    (state: NFTState) =>
    (address: string): NFT | undefined => {
      return state.all.find(({ issuer }) => issuer == address);
    },
  getSharedByAddress:
    (state: NFTState) =>
    (address: string, nodetype: keyof SharedNFTs): NFT | undefined => {
      return state.shared[nodetype].find(({ issuer }) => issuer == address);
    },
};
