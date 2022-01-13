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
  async fetchAll(
    { commit, rootGetters },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const nodetype = rootGetters["xumm/getOttData"].nodetype;
    const client = await XrpService(nodetype);
    const all = await client.fetchWallet(walletAddress);
    commit("setAll", all);
  },
  async fetchNftLines(
    { commit, rootGetters },
    { walletAddress }: FetchParams
  ): Promise<void> {
    const nodetype = rootGetters["xumm/getOttData"].nodetype;
    const client = await XrpService(nodetype);
    const linse = await client.fetchNftLines(walletAddress);
    commit("setLines", linse);
  },
  async fetchNext({ commit, getters, rootGetters }): Promise<void> {
    const nodetype = rootGetters["xumm/getOttData"].nodetype;
    const client = await XrpService(nodetype);

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
