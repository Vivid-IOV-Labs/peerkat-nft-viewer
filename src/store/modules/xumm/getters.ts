import { XummState } from "./state";
import { xAppOttData } from "xumm-sdk/dist/src/types";
export default {
  getOttData: (state: XummState): xAppOttData | null => state.OttData,
};
