import mutations from "../nft/mutations";
import actions from "../nft/actions";
import getters from "../nft/getters";
import state from "../nft/state";
import { Module } from "vuex";

export const NftModule: Module<any, any> = {
  namespaced: true,
  state: state(),
  actions,
  getters,
  mutations,
};
