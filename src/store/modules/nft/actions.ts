import {
  fetchXls20,
  init,
  fetchNextXls20WithSellOffer,
  createSellOffer,
  cancelOffer,
  createBuyOffer,
  cancelBuyOffer,
} from "../../../services/XrpService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";
type line = {
  balance: string;
  limit: string;
  balanceFormatted: string;
  limitFormatted: string;
  account: string;
  currency: string;
};
interface FetchParams {
  walletAddress: string;
  nodetype: string;
}

interface InitParams {
  network: string;
}

const actions: ActionTree<NFT, NFTState> = {
  async initXrpClient({ commit }, { network }: InitParams): Promise<void> {
    const client = await init(network);
    commit("setXrpClient", client);
    commit("setIsConnected", true);
  },
  async connect({ commit, getters }): Promise<void> {
    const client = getters.getXrpClient;
    await client.connect();
    commit("setIsConnected", true);
  },
  async disconnect({ commit, getters }): Promise<void> {
    const client = getters.getXrpClient;
    await client.disconnect();
    commit("setIsConnected", false);
  },
  async fetchNftLines(
    { commit, getters },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const client = getters.getXrpClient;
    const lines = await client.fetchNftLines(walletAddress);

    commit("setLines", lines);
  },
  async fetchNext({ commit, getters }): Promise<void> {
    const client = getters.getXrpClient;
    const count = getters.getAll.length;
    const nextLines =
      getters.getLines.length > 4
        ? getters.getLines.slice(count, count + 4)
        : getters.getLines;
    const nextNfts: NFT[] = await client.fetchNext(nextLines);
    commit("setAll", nextNfts);
  },
  async fetchXls20({ commit }, { walletAddress }: FetchParams): Promise<void> {
    const Xls20 = await fetchXls20(walletAddress);
    commit("setXls20", Xls20);
  },
  async fetchNextXls20({ commit, getters }): Promise<void> {
    const count = getters.getAll.length;
    const nextXls20 = getters.getXls20.slice(count, count + 4);
    const nextNfts = await fetchNextXls20WithSellOffer(nextXls20);
    commit("setAllXls20", nextNfts);
    commit("setAll", nextNfts);
  },

  async fetchNextSellOffers({ commit, getters, dispatch }): Promise<void> {
    const count = getters.getSellOffers.length;
    const nextXls20 = getters.getXls20.slice(count, count + 4);
    const nfts_sells = await fetchNextXls20WithSellOffer(nextXls20);
    commit("setSellOffers", nfts_sells);
    if (nfts_sells.every((a: any) => !a) && count < getters.getXls20.length) {
      await dispatch("fetchNextSellOffers");
    }
  },
  async createSellOffer(
    { commit },
    { walletAddress, TokenID, amount }
  ): Promise<void> {
    const sellOffer = await createSellOffer({ walletAddress, TokenID, amount });
    commit("addSellOffer", sellOffer);
  },
  async cancelOffer({ commit }, { TokenID, OfferID }): Promise<void> {
    const sellOffer = await cancelOffer({ TokenID, OfferID });
    const newSellOffers = sellOffer ? sellOffer : [];
    commit("addSellOffer", newSellOffers);
  },
  async cancelBuyOffer({ commit }, { TokenID, OfferID }): Promise<void> {
    const sellOffer = await cancelBuyOffer({ TokenID, OfferID });
    const newSellOffers = sellOffer ? sellOffer : [];
    commit("addBuyOffer", newSellOffers);
  },
  async createBuyOffer(
    { commit },
    { walletAddress, TokenID, Amount, Owner }
  ): Promise<void> {
    const buyOffer = await createBuyOffer({
      walletAddress,
      TokenID,
      Amount,
      Owner,
    });
    const newBuyOffers = buyOffer ? buyOffer : [];
    commit("addBuyOffer", newBuyOffers);
  },
};
export default actions;
