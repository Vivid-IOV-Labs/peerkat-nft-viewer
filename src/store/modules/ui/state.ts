export interface UiState {
  isLoading: boolean;
  scrollPositionWallet: number;
  scrollPositionShared: number;
}

const state = (): UiState => ({
  isLoading: false,
  scrollPositionWallet: 0,
  scrollPositionShared: 0,
});

export default state;
