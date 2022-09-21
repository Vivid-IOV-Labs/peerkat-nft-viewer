const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import { xAppOttData } from "xumm-sdk/dist/src/types";
import { devlog } from "../utils/devlog";
import { isInXumm } from "../utils/isInXumm";
import { openBrowser, openSignRequest } from "../utils/XummActions";

const { xAppSdk } = window as any;
let Sdk: any = null;
let xapp: any = null;
class XummService {
  constructor() {
    if (Sdk) {
      throw new Error("You can only create one instance!");
    }
    if (isInXumm()) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { XummSdkJwt } = require("xumm-sdk");
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      xapp = new xAppSdk();
      Sdk = new XummSdkJwt(xummApiKey);
    }
  }
  async getOttData(): Promise<xAppOttData> {
    const ottdata = await Sdk.getOttData();
    return ottdata;
  }
  async createPayload(
    newPayload: any,
    userToken: string,
    onSigned: any
  ): Promise<any> {
    const pong = await Sdk.ping();

    const created = await Sdk.payload.createAndSubscribe(
      {
        user_token: userToken,
        txjson: newPayload,
      },
      (event: any) => {
        if (typeof event.data.message !== "undefined") {
          const payloadEventId = event.data.message.split(" ")[1];
        }
        if (event.data.expires_in_seconds === 0) {
          devlog("expired");
        }
        if (event.data.signed === true) {
          onSigned();
        }
        if (event.data.signed === false) {
          devlog("not signed");
        }
      }
    );

    return created;
  }
  async saveToStorage(toStore: any) {
    await Sdk.storage.set(toStore);
  }
  async getStorage() {
    return await Sdk.storage.get();
  }
  async createSellOffer(
    { Account, NFTokenID, Amount, User, Destination }: any,
    onSigned: any
  ) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      NFTokenID,
      Amount,
      Destination,
      Flags: 1,
    };

    try {
      const created = await this.createPayload(transactionBlob, User, onSigned);
      devlog("Sell offercreated", created);
      return created;
    } catch (error) {
      devlog("Sell offercreated error", error);
    }
  }
  async createBuyOffer(
    { Account, NFTokenID, Amount, Owner, User }: any,
    onSigned: any
  ) {
    const transactionBlob = {
      TransactionType: "NFTokenCreateOffer",
      Account,
      Owner,
      NFTokenID,
      Amount,
      Flags: 0,
    };
    devlog("transactionBlob", transactionBlob);

    try {
      const created = await this.createPayload(transactionBlob, User, onSigned);
      devlog("Sell offercreated", created);
      return created;
    } catch (error) {
      devlog("Sell offercreated error", error);
    }
  }
  async cancelOffer({ Account, TokenIDs, User }: any, onSigned: any) {
    const transactionBlob = {
      TransactionType: "NFTokenCancelOffer",
      Account,
      NFTokenOffers: TokenIDs,
    };
    const offer = await this.createPayload(transactionBlob, User, onSigned);

    devlog("offercancelled", offer);
    return offer;
  }
  async acceptOffer({ Account, OfferID, User }: any, onSigned: any) {
    const transactionBlob = {
      TransactionType: "NFTokenAcceptOffer",
      Account,
      NFTokenSellOffer: OfferID,
    };

    try {
      const offer = await this.createPayload(transactionBlob, User, onSigned);

      devlog("Accept offer", offer);
      return offer;
    } catch (error) {
      devlog("Accept offer error", error);
    }
  }
  async acceptBuyOffer({ Account, OfferID, User }: any, onSigned: any) {
    const transactionBlob = {
      TransactionType: "NFTokenAcceptOffer",
      Account,
      NFTokenBuyOffer: OfferID,
    };

    try {
      const offer = await this.createPayload(transactionBlob, User, onSigned);

      devlog("Accept offer", offer);
      return offer;
    } catch (error) {
      devlog("Accept offer error", error);
    }
  }
  async openBrowser(url: string): Promise<void> {
    xapp
      .openBrowser({ url })
      .then((d: any) => {
        if (d instanceof Error) {
          devlog("Error:", d.message);
          openBrowser(url);
        }
      })
      .catch((e: any) => {
        devlog("Error:", e.message);
        openBrowser(url);
      });
  }
  async openSignRequest(uuid: string): Promise<void> {
    xapp
      .openSignRequest({ uuid })
      .then((d: any) => {
        if (d instanceof Error) {
          devlog("Error:", d.message);
          openSignRequest(uuid);
        }
      })
      .catch((e: any) => {
        devlog("Error:", e.message);
        openSignRequest(uuid);
      });
  }
}

const XummSDK = new XummService();

Object.freeze(XummSDK);

export default XummSDK;
