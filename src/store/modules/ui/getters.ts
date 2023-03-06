import { UiState } from "./state";

export default {
  getIsloading: (state: UiState): boolean => state.isLoading,
  getScrollPositionWallet: (state: UiState): number =>
    state.scrollPositionWallet,
  getScrollPositionShared: (state: UiState): number =>
    state.scrollPositionShared,
};
