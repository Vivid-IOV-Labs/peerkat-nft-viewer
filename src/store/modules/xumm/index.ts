import mutations from "../xumm/mutations";
import actions from "../xumm/actions";
import getters from "../xumm/getters";
import state from "../xumm/state";
import { Module } from "vuex";

export const XummModule: Module<any, any> = {
  namespaced: true,
  state: state(),
  actions,
  getters,
  mutations,
};
