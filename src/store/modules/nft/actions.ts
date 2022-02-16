import { init } from "../../../services/XrpService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";
import { trackEvent } from "../../../utils/analytics";
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
  walletAddress: string;
  nodetype: string;
  handleError: (error: unknown | null | Error) => void;
}

const actions: ActionTree<NFT, NFTState> = {
  async initXrpClient({ commit }, { nodetype }: InitParams): Promise<void> {
    const client = await init(nodetype);
    trackEvent({
      category: "Root View",
      action: "xrpl-connected",
      label: client.xrpClientInstance.endpoint,
    });

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
    const nextLines = getters.getLines.slice(count, count + 3);
    const nextNfts: NFT[] = await Promise.all(
      nextLines.map(async (line: line) => {
        const { account, currency, balanceFormatted, limitFormatted } = line;
        return client.fetchOne(
          account,
          currency,
          balanceFormatted,
          limitFormatted
        );
      })
    );
    commit("setAll", nextNfts);
  },
};
export default actions;
