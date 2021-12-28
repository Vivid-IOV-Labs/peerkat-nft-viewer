import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";

const actions: ActionTree<XummState, xAppOttData> = {
  async getOttData({ commit }): Promise<void> {
    const XummService = require("../../../services/XummService");
    const OttData = await XummService.getOttData();
    commit("setOttData", OttData);
  },
};
export default actions;
