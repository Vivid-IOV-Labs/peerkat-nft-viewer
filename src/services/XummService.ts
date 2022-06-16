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
      const urlParams = new URLSearchParams(document.location.href);
      const jwtToke = urlParams.get("xAppToken");
      console.log("Sdk jwtToke", jwtToke);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { XummSdkJwt } = require("xumm-sdk");
      Sdk = new XummSdkJwt(xummApiKey);
    }
  }
  async getOttData(): Promise<xAppOttData> {
    const ottdata = await Sdk.getOttData();
    devlog("OTTDATA", ottdata);
    return ottdata;
  }
  async createPayload(newPayload: any, userToken: string): Promise<any> {
    const pong = await Sdk.ping();
    devlog("ping pong", pong.application);

    const created = await Sdk.payload.create({
      user_token: userToken,
      txjson: newPayload,
    });

    return created;
  }
  async saveToStorage(toStore: any) {
    await Sdk.storage.set(toStore);
  }
  async getStorage() {
    return await Sdk.storage.get();
  }
  async createSellOffer({ Account, NFTokenID, Amount, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      NFTokenID,
      Amount,
      Flags: 1,
    };
    devlog("Sell transactionBlob", transactionBlob);

    try {
      const created = await this.createPayload(transactionBlob, User);
      devlog("Sell offercreated", created);
      return created;
    } catch (error) {
      devlog("Sell offercreated error", error);
    }
  }
  async createBuyOffer({ Account, NFTokenID, Amount, Owner, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      Owner,
      NFTokenID,
      Amount,
      Flags: 1,
    };

    try {
      const offer = await this.createPayload(transactionBlob, User);

      devlog("Buy offercreated", offer);
      return offer;
    } catch (error) {
      devlog("Buy offercreated error", error);
    }
  }
  async cancelOffer({ Account, TokenIDs, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCancelOffer",
      Account,
      TokenIDs,
    };
    const offer = await this.createPayload(transactionBlob, User);

    devlog("offercancelled", offer);
    return offer;
  }
  async acceptOffer({ Account, OfferID, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenAcceptOffer",
      Account,
      NFTokenSellOffer: OfferID,
    };

    try {
      const offer = await this.createPayload(transactionBlob, User);

      devlog("Accept offer", offer);
      return offer;
    } catch (error) {
      devlog("Accept offer error", error);
    }
  }
}

const XummSDK = new XummService();

Object.freeze(XummSDK);

export default XummSDK;
