import { MutationTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState } from "./state";

const mutations: MutationTree<NFTState> = {
  setAll(state: NFTState, all: Array<NFT>): void {
    state.all = [...state.all, ...all];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  addShared(state: NFTState, shared: NFT): void {
    const exist =
      state.shared.filter((n) => n.issuer === shared.issuer).length > 0;
    if (!exist) {
      state.shared = [...state.shared, shared];
    }
  },
};

export default mutations;
