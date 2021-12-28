import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";

const actions: ActionTree<XummState, xAppOttData> = {
  async getOttData({ commit }): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XummService = require("../../../services/XummService").default;
    console.log("XummService", XummService);
    const OttData = await XummService.getOttData();
    commit("setOttData", OttData);
  },
};
export default actions;
