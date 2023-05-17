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
    state.all = [...new Set([...state.all, ...all])];
  },
  setAllXls20(state: NFTState, allXls20: Array<any>): void {
    state.allXls20 = [...new Set([...state.allXls20, ...allXls20])];
  },
  setAllXls14(state: NFTState, allXls14: Array<any>): void {
    state.allXls14 = [...state.allXls14, ...allXls14];
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
  setXlsMediaUrlById(state: NFTState, params: any): void {
    const nft = state.allXls14.find((n) => n.currency == params.tokenID);
    if (nft) {
      if (params.mediaUrl) {
        nft.mediaUrl = params.mediaUrl;
      }
      if (params.thumbnailUrl) {
        nft.thumbnailUrl = params.thumbnailUrl;
      }
    }
  },
  setXls20MediaUrlById(state: NFTState, params: any): void {
    const { tokenID, mediaUrl, thumbnailUrl, shared } = params;
    const where =
      params.shared && params.shared.user
        ? state.sharedwithme[shared.user][shared.nodetype]
        : state.allXls20;
    const nft = where.find((n: any) => n.currency == tokenID);
    if (nft) {
      if (params.mediaUrl) {
        nft.mediaUrl = params.mediaUrl;
      }
      if (params.thumbnailUrl) {
        nft.thumbnailUrl = params.thumbnailUrl;
      }
    }
  },
  setXls20SharedMediaUrlById(state: NFTState, params: any): void {
    const { tokenID, mediaUrl, thumbnailUrl } = params;
    const nft = state.sharedwithme.find((n) => n.currency == tokenID);
    nft.mediaUrl = mediaUrl;
    nft.thumbnailUrl = thumbnailUrl;
  },
  setCurrent(state: NFTState, nft: NFT): void {
    state.currentNFT = nft;
  },
  setLastVisited(state: NFTState, tokenID: string): void {
    state.lastVisited = tokenID;
  },
  deleteCurrent(state: NFTState): void {
    state.currentNFT = null;
  },
  resetAll(state: NFTState): void {
    state.lines = [];
    state.all = [];
    state.allXls20 = [];
    state.xls20nfts = [];
    state.currentNFT = null;
  },
  initSharedStore(state: NFTState, walletaddress) {
    state.sharedwithme[walletaddress] = {
      TESTNET: [],
      MAINNET: [],
      CUSTOM: [],
      DEVNET: [],
      "NFT-DEVNET": [],
      "HOOKS-TESTNET": [],
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
        exist.selloffers.filter((o: any) => {
          return o.nft_offer_index == offer.nft_offer_index;
        }).length > 0;
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
