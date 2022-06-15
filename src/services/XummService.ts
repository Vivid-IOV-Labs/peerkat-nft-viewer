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
    devlog("OTTDATA", ottdata);
    return ottdata;
  }
  async createPayload(newPayload: any, userToken: string): Promise<any> {
    const pong = await Sdk.ping();
    devlog("ping pong", pong.application);
    devlog("createPayload", {
      user_token: userToken,
      txjson: newPayload,
    });

    try {
      const created = await Sdk.payload.createAndSubscribe({
        user_token: userToken,
        txjson: newPayload,
      });
      // const created = await Sdk.payload.createAndSubscribe({
      //   user_token: userToken,
      //   txjson: {
      //     TransactionType: "Payment",
      //     Amount: "1000000",
      //     Destination: "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
      //   },
      // });

      devlog("createPayload", created);

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
  async createSellOffer({ Account, TokenID, Amount, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      TokenID,
      Amount,
      Flags: 1,
    };
    try {
      const offer = await this.createPayload(transactionBlob, User);
      devlog("Sell offercreated", offer);
      return offer;
    } catch (error) {
      devlog("Sell offercreated error", error);
    }
  }
  async createBuyOffer({ Account, TokenID, Amount, Owner, User }: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      Owner,
      TokenID,
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
      SellOffer: OfferID,
    };
    const offer = await this.createPayload(transactionBlob, User);

    devlog("accept offer to sign", offer);
    return offer;
  }
}

const XummSDK = new XummService();

Object.freeze(XummSDK);

export default XummSDK;
