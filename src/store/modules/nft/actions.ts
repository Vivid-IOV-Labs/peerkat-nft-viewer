import { init } from "../../../services/XrpService";
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
  nodetype: string;
  // handleError: (error: string) => void;
}

const actions: ActionTree<NFT, NFTState> = {
  async fetchAll(
    { commit },
    { walletAddress, nodetype }: FetchParams
  ): Promise<void> {
    const client = await init(nodetype);
    const all = await client.fetchWallet(walletAddress);
    commit("setAll", all);
  },
  async fetchNftLines(
    { commit },
    { walletAddress, nodetype }: FetchParams
  ): Promise<void> {
    const client = await init(nodetype);
    const linse = await client.fetchNftLines(walletAddress);
    commit("setLines", linse);
  },
  async fetchNext({ commit, getters }, nodetype: string): Promise<void> {
    const client = await init(nodetype);

    const count = getters.getAll.length;

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
