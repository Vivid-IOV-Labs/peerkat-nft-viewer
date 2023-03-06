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
};

export default mutations;
