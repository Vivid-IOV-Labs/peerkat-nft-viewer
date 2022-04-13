import { MutationTree } from "vuex";
import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";
import { NFTState, SharedNFTs } from "./state";
interface addSharedParams {
  shared: NFT;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
interface deleteSharedParams {
  issuer: string;
  nodetype: keyof SharedNFTs;
  walletaddress: string;
}
const mutations: MutationTree<NFTState> = {
  setXrpClient(state: NFTState, xrpClient: typeof XrplClient): void {
    state.xrpClient = xrpClient;
  },
  setIsConnected(state: NFTState, isConnected: boolean): void {
    state.isConnected = isConnected;
  },
  setAll(state: NFTState, all: Array<NFT>): void {
    state.all = [...state.all, ...all];
  },
  setLines(state: NFTState, lines: Array<any>): void {
    state.lines = lines;
  },
  resetAll(state: NFTState): void {
    state.lines = [];
    state.all = [];
  },
  initSharedStore(state: NFTState, walletaddress) {
    state.sharedwithme[walletaddress] = {
      TESTNET: [],
      MAINNET: [],
      CUSTOM: [],
      DEVNET: [],
    };
  },
  addShared(
    state: NFTState,
    { shared, nodetype, walletaddress }: addSharedParams
  ): void {
    const exist =
      state.sharedwithme[walletaddress][nodetype].filter(
        (n: { issuer: string; currency: string }) =>
          n.issuer === shared.issuer && n.issuer === shared.currency
      ).length > 0;

    if (!exist) {
      state.sharedwithme[walletaddress][nodetype] = [
        ...state.sharedwithme[walletaddress][nodetype],
        shared,
      ];
    }
  },
  deleteShared(
    state: NFTState,
    { issuer, nodetype, walletaddress }: deleteSharedParams
  ): void {
    state.sharedwithme[walletaddress][nodetype] = state.sharedwithme[
      walletaddress
    ][nodetype].filter((n) => n.issuer !== issuer);
  },
};

export default mutations;
