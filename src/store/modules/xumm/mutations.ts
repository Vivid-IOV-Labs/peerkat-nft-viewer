import { MutationTree } from "vuex";
import { OttData } from "../../../models/OttData";
import { XummState } from "./state";

const mutations: MutationTree<XummState> = {
  setOttData(state: XummState, OttData: OttData): void {
    state.OttData = OttData;
  },
};

export default mutations;
