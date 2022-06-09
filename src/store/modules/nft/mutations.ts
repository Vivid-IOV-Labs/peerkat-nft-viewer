import { MutationTree } from "vuex";
import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";
import { NFTState, SharedNFTs } from "./state";
interface addSharedParams {
  shared: NFT;
  offer?: any;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
interface deleteSharedParams {
  issuer: string;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
const mutations: MutationTree<NFTState> = {
  setXrpClient(state: NFTState, xrpClient: typeof XrplClient): void {
    state.xrpClient = xrpClient;
  },
  setIsConnected(state: NFTState, isConnected: boolean): void {
    state.isConnected = isConnected;
  },
  setAll(state: NFTState, all: Array<any>): void {
    state.all = [...state.all, ...all];
  },
  setAllXls20(state: NFTState, allXls20: Array<any>): void {
    state.allXls20 = [...state.allXls20, ...allXls20];
  },
  setSellOffers(state: NFTState, sellOffers: Array<any>): void {
    state.sellOffers = [...state.sellOffers, ...sellOffers];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  setXls20(state: NFTState, xls20nfts: Array<any>): void {
    state.xls20nfts = xls20nfts;
  },
  setCurrent(state: NFTState, nft: NFT): void {
    state.currentNFT = nft;
  },
  resetAll(state: NFTState): void {
    state.lines = [];
    state.all = [];
  },
  initSharedStore(state: NFTState, walletaddress) {
    state.sharedwithme[walletaddress] = {
      TESTNET: [],
      MAINNET: [],
      CUSTOM: [],
      DEVNET: [],
    };
  },
  initSharedSellOffersStore(state: NFTState, walletaddress) {
    state.sharedSellOffers[walletaddress] = [];
  },
  addSharedSellOffers(state: NFTState, { selloffer, walletaddress }: any) {
    console.log("state.sharedSellOffers");
    console.log(state.sharedSellOffers);
    console.log(state.sharedSellOffers[walletaddress]);
    const exist =
      state.sharedSellOffers[walletaddress].filter((o: any) => {
        o.offer.nft_offer_index == selloffer.offer.nft_offer_index;
      }).length > 0;

    if (!exist) {
      state.sharedSellOffers[walletaddress] = [
        ...state.sharedSellOffers[walletaddress],
        selloffer,
      ];
    }
  },
  addShared(
    state: NFTState,
    { shared, nodetype, walletaddress, offer }: addSharedParams
  ): void {
    const exist = state.sharedwithme[walletaddress][nodetype].find(
      (n: { issuer: string; currency: string }) => {
        console.log(n.issuer, shared.issuer);
        console.log(n.currency, shared.currency);
        return n.issuer === shared.issuer && n.currency === shared.currency;
      }
    );
    debugger;
    if (!exist) {
      if (offer) {
        shared.selloffers = [];
        shared.selloffers = [offer];
      }
      debugger;
      state.sharedwithme[walletaddress][nodetype] = [
        ...state.sharedwithme[walletaddress][nodetype],
        shared,
      ];
    }
    if (exist && offer) {
      const offerExists =
        exist.selloffers &&
        exist.selloffers.filter((o: any) => {
          o.nft_offer_index == offer.nft_offer_index;
        }).length > 0;
      debugger;
      if (!offerExists) {
        exist.selloffers = [...exist.selloffers, offer];
        debugger;
      }
    }
  },

  addSellOffer(state, { offers }) {
    if (state.currentNFT) state.currentNFT.selloffers = offers ? offers : [];
  },
  addBuyOffer(state, { offers }) {
    if (state.currentNFT) state.currentNFT.buyoffers = offers ? offers : [];
  },
  deleteShared(
    state: NFTState,
    { issuer, nodetype, walletaddress }: deleteSharedParams
  ): void {
    state.sharedwithme[walletaddress][nodetype] = state.sharedwithme[
      walletaddress
    ][nodetype].filter((n) => n.issuer !== issuer);
  },
};

export default mutations;
