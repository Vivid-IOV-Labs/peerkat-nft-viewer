import { XrplClient } from "xrpl-client";
import { NFTState, SharedNFTs } from "./state";
interface NFT {
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getXrpClient: (state: NFTState): typeof XrplClient | null => state.xrpClient,
  getIsConnected: (state: NFTState): boolean => state.isConnected,
  getShared:
    (state: NFTState) =>
    (nodetype: keyof SharedNFTs): Array<NFT> => {
      return state.sharedwithme[nodetype];
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
      return state.sharedwithme[nodetype].find(
        ({ issuer }) => issuer == address
      );
    },
};
