import { init } from "../../../services/XrpService";
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
  nodetype: string;
}

const actions: ActionTree<NFT, NFTState> = {
  initXrpClient({ commit }, { nodetype }: InitParams): void {
    const client = init(nodetype);
    commit("setXrpClient", client);
    commit("setIsConnected", true);
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
    const nextLines = getters.getLines.slice(count, count + 2);
    const nextNfts: NFT[] = await client.fetchNext(nextLines);
    commit("setAll", nextNfts);
  },
};
export default actions;
