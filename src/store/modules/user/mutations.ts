import { MutationTree } from "vuex";
import { UserState } from "./state";

const mutations: MutationTree<UserState> = {
  setNodeType(state: UserState, nodetype: string): void {
    state.nodetype = nodetype;
  },
  setAddress(state: UserState, address: string): void {
    state.address = address;
  },
};

export default mutations;
