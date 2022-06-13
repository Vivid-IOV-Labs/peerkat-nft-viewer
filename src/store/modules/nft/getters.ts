import { XrplClient } from "xrpl-client";
import { NFTState, SharedNFTs } from "./state";
interface NFT {
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getAllXls20: (state: NFTState): Array<NFT> => state.allXls20,
  getCurrent: (state: NFTState): NFT | null => state.currentNFT,
  getXrpClient: (state: NFTState): typeof XrplClient | null => state.xrpClient,
  getIsConnected: (state: NFTState): boolean => state.isConnected,

  getSharedBuyOffers:
    (state: NFTState, _getters: any, rootState: any) =>
    (TokenID: string): any => {
      const useraddress = rootState.user.address;
      state.sharedBuyOffers[useraddress][TokenID];
      return !state.sharedBuyOffers[useraddress]
        ? null
        : !state.sharedBuyOffers[useraddress][TokenID]
        ? []
        : state.sharedBuyOffers[useraddress][TokenID];
    },
  getShared:
    (state: NFTState, _getters: any, rootState: any) =>
    (nodetype: keyof SharedNFTs): Array<NFT> | null => {
      const useraddress = rootState.user.user;
      return !state.sharedwithme[useraddress]
        ? null
        : state.sharedwithme[useraddress][nodetype];
    },
  getLines: (state: NFTState): Array<NFT> => state.lines,
  getXls20ByTokenId:
    (state: NFTState) =>
    (TokenID: string): any => {
      return state.allXls20.find(({ currency }) => currency == TokenID);
    },
  getXls20: (state: NFTState): Array<NFT> => state.xls20nfts,
  getSellOffers: (state: NFTState): Array<any> => state.sellOffers,
  getBuyOffers: (state: NFTState): Array<any> => state.buyOffers,
  getByAddress:
    (state: NFTState) =>
    (address: string, curr: string): NFT | undefined => {
      return state.all.find(
        ({ issuer, currency }) => issuer == address && currency == curr
      );
    },
  getSharedByAddress:
    (state: NFTState, _getters: any, rootState: any) =>
    (
      address: string,
      nodetype: keyof SharedNFTs,
      curr: string
    ): NFT | undefined => {
      const useraddress = rootState.user.user;
      return state.sharedwithme[useraddress][nodetype].find(
        ({ issuer, currency }) => issuer == address && currency == curr
      );
    },
};
