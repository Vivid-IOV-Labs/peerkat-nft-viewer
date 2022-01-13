import { MutationTree } from "vuex";
import { NFT } from "../../../models/NFT";
import { NFTState, SharedNFTs } from "./state";
interface addSharedParams {
  shared: NFT;
  nodetype: keyof SharedNFTs;
}
interface deleteSharedParams {
  issuer: string;
  nodetype: keyof SharedNFTs;
}
const mutations: MutationTree<NFTState> = {
  setAll(state: NFTState, all: Array<NFT>): void {
    state.all = [...state.all, ...all];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  addShared(state: NFTState, { shared, nodetype }: addSharedParams): void {
    const exist =
      state.shared[nodetype].filter(
        (n: { issuer: string }) => n.issuer === shared.issuer
      ).length > 0;
    if (!exist) {
      state.shared[nodetype] = [...state.shared[nodetype], shared];
    }
  },
  deleteShared(
    state: NFTState,
    { issuer, nodetype }: deleteSharedParams
  ): void {
    state.shared[nodetype] = state.shared[nodetype].filter(
      (n) => n.issuer !== issuer
    );
  },
};

export default mutations;
