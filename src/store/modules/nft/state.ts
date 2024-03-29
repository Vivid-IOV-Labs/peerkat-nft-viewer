import { XrplClient } from "xrpl-client";
import { NFT } from "../../../models/NFT";

export interface SharedNFTs {
  [id: string]: Array<NFT>;
}
export interface SharedNFTsByWallet {
  [walletaddress: string]: any;
}
export interface NFTState {
  all: Array<NFT>;
  sharedwithme: any;
  lines: Array<NFT>;
  xls20nfts: Array<any>;
  allXls20: Array<any>;
  allXls14: Array<any>;
  sellOffers: Array<any>;
  buyOffers: Array<any>;
  sharedBuyOffers: any;
  xrpClient: typeof XrplClient | null;
  currentNFT: any;
  lastVisited: any;
  isConnected: boolean;
}

const state = (): NFTState => ({
  all: [],
  allXls20: [],
  allXls14: [],
  currentNFT: null,
  lastVisited: null,
  sellOffers: [],
  buyOffers: [],
  sharedBuyOffers: {},
  sharedwithme: {},
  lines: [],
  xls20nfts: [],
  xrpClient: null,
  isConnected: false,
});

export default state;
