import { fetchWallet } from "../../../services/XrpService";
import { ActionTree } from "vuex";
interface NFT {
  url: string;
  issuer: string;
  currency: string;
}
interface MediaState {
  all: Array<NFT>;
}

interface FetchParams {
  walletAddress: string;
  network: string;
  handleError: (error: string) => void;
}
const actions: ActionTree<NFT, MediaState> = {
  async fetchAll(
    { commit },
    { walletAddress, network, handleError }: FetchParams
  ): Promise<void> {
    debugger;
    const all = await fetchWallet(walletAddress, network, handleError);
    debugger;
    commit("setAll", all);
  },
  // async claim({ commit }, NFT: NFT): Promise<void> {
  //   const claimedNFT = await NFTService.claim(NFT);
  //   commit("set", claimedNFT);
  // },
  // async remove({ commit }, mediaID: string): Promise<void> {
  //   await NFTService.remove(mediaID);
  //   commit("remove", mediaID);
  // },
};
export default actions;
