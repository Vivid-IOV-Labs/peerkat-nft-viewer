const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";
import { devlog } from "../utils/devlog";
import { isInXumm } from "../utils/isInXumm";

let Sdk: any = null;

class XummService {
  constructor() {
    if (Sdk) {
      throw new Error("You can only create one instance!");
    }
    if (isInXumm()) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { XummSdkJwt } = require("xumm-sdk");
      Sdk = new XummSdkJwt(xummApiKey);
    }
  }
  async getOttData(): Promise<xAppOttData> {
    const ottdata = await Sdk.getOttData();
    devlog("ottdata", ottdata.value);
    return ottdata;
  }
  async createPayload(newPayload: any): Promise<any> {
    const pong = await Sdk.ping();
    console.log(pong.application);
    try {
      const created = await Sdk.payload.create(newPayload);
      return created;
    } catch (error) {
      devlog("createpayload", error);
    }
  }
  async saveToStorage(toStore: any) {
    await Sdk.storage.set(toStore);
  }
  async getStorage() {
    return await Sdk.storage.get();
  }
  async createSellOffer({ Account, TokenID, Amount }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      TokenID,
      Amount,
      Flags: 1,
    };
    const offer = await this.createPayload({
      txjson: transactionBlob,
    });
    devlog("offercreated", offer);
    return offer;
  }
  async createBuyOffer({ Account, TokenID, Amount, Owner }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      Owner,
      TokenID,
      Amount,
      Flags: 1,
    };

    const offer = await this.createPayload({
      txjson: transactionBlob,
    });
    devlog("offercreated", offer);
    return offer;
  }
  async cancelOffer({ Account, TokenIDs }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCancelOffer",
      Account,
      TokenIDs,
    };
    const offer = await this.createPayload({
      txjson: transactionBlob,
    });
    devlog("offercancelled", offer);
    return offer;
  }
  async acceptOffer({ Account, OfferID }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenAcceptOffer",
      Account,
      SellOffer: OfferID,
    };
    const resp = await this.createPayload({
      txjson: transactionBlob,
    });
    devlog("accept offer to sign", resp);
    return resp;
  }
}

const XummSDK = new XummService();

Object.freeze(XummSDK);

export default XummSDK;
