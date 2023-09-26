import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";
import XummService from "../../../services/XummService";
import { getNodeTypeFromNetwork } from "../../../utils/getNetworkTypeFromCode";

const actions: ActionTree<XummState, xAppOttData> = {
  async getOttData({ commit }): Promise<void> {
    try {
      const ottdata = await XummService.getOttData();
      if (ottdata && ottdata.nodewss) {
        commit("setOttData", ottdata);
        commit("user/setAddress", ottdata.account, { root: true });
        commit("user/setNetwork", ottdata.nodewss, { root: true });
        const nodetype = getNodeTypeFromNetwork(ottdata.nodewss);
        commit("user/setNodeType", nodetype, { root: true });
        commit("user/setUser", ottdata.user, { root: true });
      }
    } catch (error) {
      console.log("OTTDATA vuex", error);
    }
  },
};
export default actions;
