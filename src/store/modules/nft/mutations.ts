import { MutationTree } from "vuex";
import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";
import { NFTState, SharedNFTs } from "./state";
interface addSharedParams {
  shared: NFT;
  offer?: any;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
  user: string;
}
interface deleteSharedParams {
  currency: string;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
interface addBuyOfferParams {
  offers: any[];
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
interface deleteBuyOfferParams {
  offerID: string;
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
  deleteCurrent(state: NFTState): void {
    state.currentNFT = null;
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
  // initSharedBuyOffersStore(state: NFTState, walletaddress) {
  //   state.sharedBuyOffers[walletaddress] = {};
  // },
  // addSharedBuyOffer(state: NFTState, { buyoffer, walletaddress, nftID }: any) {
  //   if (!state.sharedBuyOffers[walletaddress]) {
  //     state.sharedBuyOffers[walletaddress] = {};
  //   }
  //   if (!state.sharedBuyOffers[walletaddress][nftID]) {
  //     state.sharedBuyOffers[walletaddress][nftID] = [buyoffer];
  //   } else {
  //     const exist =
  //       state.sharedBuyOffers[walletaddress][nftID].filter((o: any) => {
  //         return o.nft_offer_index == buyoffer.nft_offer_index;
  //       }).length > 0;
  //     if (!exist) {
  //       state.sharedBuyOffers[walletaddress][nftID] = [
  //         ...state.sharedBuyOffers[walletaddress][nftID],
  //         buyoffer,
  //       ];
  //     }
  //   }
  // },
  // deleteSharedBuyOffer(state: NFTState, { walletaddress, nftID }: any) {
  //   if (state.sharedBuyOffers[walletaddress][nftID]) {
  //     state.sharedBuyOffers[walletaddress][nftID] = [];
  //   }
  // },
  addShared(
    state: NFTState,
    { shared, nodetype, walletaddress, offer, user }: addSharedParams
  ): void {
    const exist: any = state.sharedwithme[user][nodetype].find(
      (n: { issuer: string; currency: string }) => {
        return n.issuer === shared.issuer && n.currency === shared.currency;
      }
    );
    shared.owner = walletaddress;
    if (!exist) {
      if (offer) {
        shared.selloffers = [offer];
      }
      state.sharedwithme[user][nodetype] = [
        ...state.sharedwithme[user][nodetype],
        shared,
      ];
    }
    if (exist && offer) {
      if (!exist.selloffers) {
        exist.selloffers = [];
      }
      const offerExists =
        exist.selloffers &&
        exist.selloffers.filter((o: any) => {
          o.nft_offer_index == offer.nft_offer_index;
        }).length > 0;
      console.log("offerExists", offerExists);
      console.log("selloffers", exist.selloffers);
      if (!offerExists) {
        exist.selloffers = [...exist.selloffers, offer];
      }
    }
  },
  addSellOffer(state, offers) {
    if (state.currentNFT) {
      state.currentNFT.selloffers = offers ? offers : [];

      const { currency } = state.currentNFT;
      const currentNft: any = state.allXls20.find(
        (n) => n.currency === currency
      );
      if (currentNft) {
        currentNft.selloffers = offers ? offers : [];
      }
    }
  },
  deleteSellOffer(state, { offerID }) {
    if (state.currentNFT) {
      state.currentNFT.selloffers = state.currentNFT.selloffers.filter(
        (o: any) => {
          return o.nft_offer_index != offerID;
        }
      );
      const { currency } = state.currentNFT;
      const currentNft: any = state.allXls20.find(
        (n) => n.currency === currency
      );
      if (currentNft) {
        if (!currentNft.selloffers) currentNft.selloffers = [];
        currentNft.selloffers = currentNft.selloffers.filter((o: any) => {
          return o.nft_offer_index != offerID;
        });
      }
    }
  },
  addBuyOffer(state, { offers, nodetype, walletaddress }: addBuyOfferParams) {
    if (state.currentNFT) {
      state.currentNFT.buyoffers = offers ? offers : [];
    }
    if (state.currentNFT) {
      const { currency } = state.currentNFT;
      if (state.sharedwithme[walletaddress][nodetype]) {
        const currentNft: any = state.sharedwithme[walletaddress][
          nodetype
        ].find((n: any) => n.currency === currency);
        if (currentNft) {
          currentNft.buyoffers = offers ? offers : [];
        }
      }
    }
  },
  deleteBuyOffer(
    state,
    { offerID, nodetype, walletaddress }: deleteBuyOfferParams
  ) {
    if (state.currentNFT) {
      state.currentNFT.buyoffers = state.currentNFT.buyoffers.filter(
        (o: any) => {
          return o.nft_offer_index != offerID;
        }
      );

      const { currency } = state.currentNFT;
      if (state.sharedwithme[walletaddress][nodetype]) {
        const currentNft: any = state.sharedwithme[walletaddress][
          nodetype
        ].find((n) => n.currency === currency);

        if (currentNft) {
          if (!currentNft.buyoffers) currentNft.buyoffers = [];
          currentNft.buyoffers = currentNft.buyoffers.filter((o: any) => {
            return o.nft_offer_index != offerID;
          });
        }
      }
    }
  },
  deleteShared(
    state: NFTState,
    { currency, nodetype, walletaddress }: deleteSharedParams
  ): void {
    state.sharedwithme[walletaddress][nodetype] = state.sharedwithme[
      walletaddress
    ][nodetype].filter((n) => n.currency !== currency);
  },
};

export default mutations;
