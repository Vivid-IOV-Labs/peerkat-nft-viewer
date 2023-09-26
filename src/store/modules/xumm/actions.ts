import { ActionTree } from "vuex";
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { XummState } from "./state";
import XummService from "../../../services/XummService";
import { getNodeTypeFromNetwork } from "../../../utils/getNetworkTypeFromCode";

const actions: ActionTree<XummState, xAppOttData> = {
  async getOttData({ commit }): Promise<void> {
    try {
      const OttData = await XummService.getOttData();
      commit("setOttData", OttData);
      commit("user/setAddress", OttData.value.account, { root: true });
      commit("user/setNetwork", OttData.value.nodewss, { root: true });
      const nodetype = getNodeTypeFromNetwork(OttData.value.nodewss);
      commit("user/setNodeType", nodetype, {
        root: true,
      });
      commit("user/setUser", OttData.value.user, {
        root: true,
      });
    } catch (error) {
      console.log("Error Vuex OTTDATA");
    }
  },
};
export default actions;
