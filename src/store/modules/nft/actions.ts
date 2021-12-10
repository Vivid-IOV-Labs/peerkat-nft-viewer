import {
  fetchNftLines,
  fetchOne,
  fetchWallet,
} from "../../../services/XrpService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
};
interface FetchParams {
  walletAddress: string;
  network: string;
  // handleError: (error: string) => void;
}

const actions: ActionTree<NFT, NFTState> = {
  async fetchAll({ commit }, { walletAddress }: FetchParams): Promise<void> {
    const all = await fetchWallet(walletAddress);
    commit("setAll", all);
  },
  async fetchNftLines(
    { commit },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const linse = await fetchNftLines(walletAddress);
    commit("setLines", linse);
  },
  async fetchNext({ commit, getters }): Promise<void> {
    const count = getters.getAll.length;
    const nextLines = getters.getLines.slice(count, count + 4);
    console.log(getters.getAll, getters.getLines);
    const nextNfts: NFT[] = await Promise.all(
      nextLines.map(async (line: line) => {
        const { account, currency } = line;

        return fetchOne(account, currency);
      })
    );

    commit("setAll", nextNfts);
  },
};
export default actions;
