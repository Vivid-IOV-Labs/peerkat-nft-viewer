import XrpService from "../../../services/XrpService";
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
    const client = await XrpService;
    const all = await client.fetchWallet(walletAddress);
    commit("setAll", all);
  },
  async fetchNftLines(
    { commit },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const client = await XrpService;
    debugger;
    const linse = await client.fetchNftLines(walletAddress);
    commit("setLines", linse);
  },
  async fetchNext({ commit, getters }): Promise<void> {
    const client = await XrpService;
    console.log(1, getters);
    const count = getters.getAll.length;
    console.log(2, getters);

    const nextLines = getters.getLines.slice(count, count + 4);
    const nextNfts: NFT[] = await Promise.all(
      nextLines.map(async (line: line) => {
        const { account, currency } = line;

        return client.fetchOne(account, currency);
      })
    );

    commit("setAll", nextNfts);
  },
};
export default actions;
