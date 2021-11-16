import { xAppOttData } from "xumm-sdk/dist/src/types";

export interface XummState {
  ottData: xAppOttData | null;
}
export default {
  getOttData: (state: XummState): xAppOttData | null => state.ottData,
};
