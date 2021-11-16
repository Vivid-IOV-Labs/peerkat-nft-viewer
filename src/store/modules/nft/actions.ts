import { fetchWallet } from "../../../services/XrpService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";

interface FetchParams {
  walletAddress: string;
  network: string;
  handleError: (error: string) => void;
}
const actions: ActionTree<NFT, NFTState> = {
  async fetchAll(
    { commit },
    { walletAddress, network, handleError }: FetchParams
  ): Promise<void> {
    const all = await fetchWallet(walletAddress, network, handleError);
    commit("setAll", all);
  },
};
export default actions;
