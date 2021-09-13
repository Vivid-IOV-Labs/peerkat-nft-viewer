import NFTService from "../../../services/NFTService";
import { ActionTree } from "vuex";
import { NFT } from "../../../models/NFT";

interface MediaState {
  all: Array<NFT>;
}

const actions: ActionTree<NFT, MediaState> = {
  async fetchAll({ commit }, params): Promise<void> {
    const { media, total } = await NFTService.list(params);
    commit("setAll", media);
    commit("setTotalItems", total);
  },
  setQuery({ commit }, query) {
    commit("setQuery", query);
  },
  async create({ commit }, newNFTH: NFT["details"]): Promise<void> {
    const newAddedMedia = await NFTService.create(newNFTH);
    commit("add", newAddedMedia);
  },
  async approve({ commit }, NFT: NFT): Promise<void> {
    const { nft: approvedNFT } = await NFTService.approve(NFT);
    commit("set", approvedNFT);
  },
  async remove({ commit }, mediaID: string): Promise<void> {
    await NFTService.remove(mediaID);
    commit("remove", mediaID);
  },
};
export default actions;
