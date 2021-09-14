import { MutationTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";

const mutations: MutationTree<NFTState> = {
  setAll(state: NFTState, all: Array<NFT>): void {
    state.all = all;
  },
  setTotalItems(state: NFTState, total: number): void {
    state.totalItems = total;
  },
  setQuery(state: NFTState, query: Record<string, string | number>): void {
    state.query = query;
  },
  set(state: NFTState, updatedNft: NFT): void {
    const index = state.all.findIndex((nft) => {
      nft.id === updatedNft._id || nft.id === updatedNft.id;
    });
    if (index > 0) {
      state.all[index] = updatedNft;
    }
  },
  add(state: NFTState, newMedia: NFT): void {
    state.all = [newMedia, ...state.all];
  },
  remove(state: NFTState, id: string): void {
    state.all = state.all.filter((media) => media.id !== id);
  },
};

export default mutations;
