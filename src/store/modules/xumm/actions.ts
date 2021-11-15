import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";
import { getOttData } from "../../../services/XummService";
const actions: ActionTree<xAppOttData, XummState> = {
  async getOttData({ commit }): Promise<void> {
    const OttData = await getOttData();
    commit("setOttData", OttData);
  },
};
export default actions;
