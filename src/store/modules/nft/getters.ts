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
    (state: NFTState, _getters: any, rootState: any) =>
    (nodetype: keyof SharedNFTs): Array<NFT> | null => {
      const useraddress = rootState.user.user;
      return !state.sharedwithme[useraddress]
        ? null
        : state.sharedwithme[useraddress][nodetype];
    },
  getLines: (state: NFTState): Array<NFT> => state.lines,
  getByAddress:
    (state: NFTState) =>
    (address: string): NFT | undefined => {
      return state.all.find(({ issuer }) => issuer == address);
    },
  getSharedByAddress:
    (state: NFTState, _getters: any, rootState: any) =>
    (address: string, nodetype: keyof SharedNFTs): NFT | undefined => {
      const useraddress = rootState.user.user;
      return state.sharedwithme[useraddress][nodetype].find(
        ({ issuer }) => issuer == address
      );
    },
};
