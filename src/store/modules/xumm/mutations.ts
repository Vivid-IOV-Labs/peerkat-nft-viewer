import { MutationTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";

const mutations: MutationTree<XummState> = {
  setOttData(state: XummState, OttData: xAppOttData | null): void {
    state.ottData = OttData;
  },
};

export default mutations;
