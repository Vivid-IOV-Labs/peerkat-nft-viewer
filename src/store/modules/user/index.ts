import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import state from "./state";
import { Module } from "vuex";

export const UserModule: Module<any, any> = {
  namespaced: true,
  state: state(),
  actions,
  getters,
  mutations,
};
