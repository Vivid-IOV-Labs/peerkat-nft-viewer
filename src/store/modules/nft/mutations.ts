import { MutationTree } from "vuex";
import { XrplClient } from "xrpl-client";
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
  setXrpClient(state: NFTState, xrpClient: typeof XrplClient): void {
    state.xrpClient = xrpClient;
  },
  setAll(state: NFTState, all: Array<NFT>): void {
    state.all = [...state.all, ...all];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  addShared(state: NFTState, { shared, nodetype }: addSharedParams): void {
    const exist =
      state.sharedwithme[nodetype].filter(
        (n: { issuer: string }) => n.issuer === shared.issuer
      ).length > 0;

    if (!exist) {
      state.sharedwithme[nodetype] = [...state.sharedwithme[nodetype], shared];
    }
  },
  deleteShared(
    state: NFTState,
    { issuer, nodetype }: deleteSharedParams
  ): void {
    state.sharedwithme[nodetype] = state.sharedwithme[nodetype].filter(
      (n) => n.issuer !== issuer
    );
  },
};

export default mutations;
