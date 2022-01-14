import { UserState } from "./state";

export default {
  getNodeType: (state: UserState): string => state.nodetype,
  getAddress: (state: UserState): string => state.address,
};
