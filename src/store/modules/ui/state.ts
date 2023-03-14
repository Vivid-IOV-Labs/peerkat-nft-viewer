export interface UiState {
  isLoading: boolean;
  scrollPositionWallet: number;
  scrollPositionShared: number;
  lastView: string;
}

const state = (): UiState => ({
  isLoading: false,
  scrollPositionWallet: 0,
  scrollPositionShared: 0,
  lastView: "/",
});

export default state;
