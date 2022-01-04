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
    if (state.shared.find((s) => s.issuer !== shared.issuer)) {
      state.shared = [...state.shared, shared];
    }
  },
};

export default mutations;
