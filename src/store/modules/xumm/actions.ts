import { ActionTree } from "vuex";
import type { OttData } from "../../../models/OttData";
import { XummState } from "./state";
import { getOttData } from "../../../services/XummService";
const actions: ActionTree<OttData, XummState> = {
  async getOttData({ commit }): Promise<void> {
    const OttData = await getOttData();
    commit("setOttData", OttData);
  },
};
export default actions;
