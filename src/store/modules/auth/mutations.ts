import { MutationTree } from "vuex";
import { User } from "../../../models/User";
import { AuthState } from "./state";

const mutations: MutationTree<AuthState> = {
  setCurrentUser(state: AuthState, user: User): void {
    state.currentUser = user;
  },
};

export default mutations;
