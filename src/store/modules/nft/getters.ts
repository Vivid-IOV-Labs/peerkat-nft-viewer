import { XrplClient } from "xrpl-client";
import { NFTState, SharedNFTs } from "./state";
interface NFT {
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getAllXls14: (state: NFTState): Array<NFT> => state.allXls14,
  getAllXls20: (state: NFTState): Array<NFT> => state.allXls20,
  getCurrent: (state: NFTState): NFT | null => state.currentNFT,
  getXrpClient: (state: NFTState): typeof XrplClient | null => state.xrpClient,
  getIsConnected: (state: NFTState): boolean => state.isConnected,
  getShared:
    (state: NFTState, _getters: any, rootState: any) =>
    (nodetype: keyof SharedNFTs, owner?: any): Array<NFT> | null => {
      const useraddress = rootState.user.user;
      return !state.sharedwithme[useraddress]
        ? null
        : state.sharedwithme[useraddress][nodetype];
      // .filter(
      //     (nft) => nft.owner !== owner
      //   );
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
      if (state.sharedwithme[useraddress][nodetype]) {
        return state.sharedwithme[useraddress][nodetype].find(
          ({ issuer, currency }) => issuer == address && currency == curr
        );
      } else return undefined;
    },
};
