export interface UiState {
  isLoading: boolean;
}

const state = (): UiState => ({
  isLoading: true,
});

export default state;
