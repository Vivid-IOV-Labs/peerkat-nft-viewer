import { xAppOttData } from "xumm-sdk/dist/src/types";

export interface XummState {
  ottData: xAppOttData | null;
}

const state = (): XummState => ({
  ottData: null,
});

export default state;
