import { UserState } from "./state";

export default {
  getNodeType: (state: UserState): string => state.nodetype,
  getNetwork: (state: UserState): string => state.network,
  getAddress: (state: UserState): string => state.address,
  getUser: (state: UserState): string => state.user,
};
