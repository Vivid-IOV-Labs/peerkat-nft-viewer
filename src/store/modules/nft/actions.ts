import {
  fetchNextXls20,
  fetchNextSellOffers,
  fetchXls20,
  init,
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
    const nextNfts = await fetchNextXls20(nextXls20);
    commit("setAllXls20", nextNfts);
    commit("setAll", nextNfts);
  },

  async fetchNextSellOffers({ commit, getters }): Promise<void> {
    const count = getters.getAll.length;
    const nextXls20 = getters.getXls20.slice(count, count + 4);
    const nextNfts = await fetchNextSellOffers(nextXls20);
    commit("setAllXls20", nextNfts);
    commit("setAll", nextNfts);
  },
};
export default actions;
