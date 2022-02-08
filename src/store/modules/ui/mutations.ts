import { MutationTree } from "vuex";
import { UiState } from "./state";

const mutations: MutationTree<UiState> = {
  setIsloading(state: UiState, isLoading: boolean): void {
    state.isLoading = isLoading;
  },
};

export default mutations;
