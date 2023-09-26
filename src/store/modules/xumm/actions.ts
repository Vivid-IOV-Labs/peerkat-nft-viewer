import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";
import XummService from "../../../services/XummService";

const actions: ActionTree<XummState, xAppOttData> = {
  async getOttData({ commit }): Promise<void> {
    try {
      const OttData = await XummService.getOttData();
      commit("setOttData", OttData);
    } catch (error) {
      console.log("OTTDATA vuex", error);
    }
  },
};
export default actions;
