export interface UiState {
  isLoading: boolean;
}

const state = (): UiState => ({
  isLoading: false,
});

export default state;
