import { MutationTree } from "vuex";
import { UiState } from "./state";

const mutations: MutationTree<UiState> = {
  setIsloading(state: UiState, isLoading: boolean): void {
    state.isLoading = isLoading;
  },
  setScrollPositionShared(state: UiState, scrollPositionShared: number): void {
    state.scrollPositionShared = scrollPositionShared;
  },
  setScrollPositionWallet(state: UiState, scrollPositionWallet: number): void {
    state.scrollPositionWallet = scrollPositionWallet;
  },
  setLastView(state: UiState, lastView: string): void {
    state.lastView = lastView;
  },
};

export default mutations;
