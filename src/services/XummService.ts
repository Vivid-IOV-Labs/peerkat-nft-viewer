const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";

let Sdk: any = null;
const isInXumm = /xumm/.test(navigator.userAgent);

class XummService {
  constructor() {
    if (Sdk) {
      throw new Error("You can only create one instance!");
    }
    if (isInXumm) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { XummSdkJwt } = require("xumm-sdk");
      Sdk = new XummSdkJwt(xummApiKey);
    }
  }
  async getOttData(): Promise<xAppOttData> {
    const ottdata = await Sdk.getOttData();
    return ottdata;
  }
  async createPaylod(newPayload: XummTypes.CreatePayload): Promise<any> {
    const created = await Sdk.payload.create(newPayload);
    return created;
  }
  async saveToStorage(toStore: any) {
    await Sdk.storage.set(toStore);
  }
  async getStorage() {
    return await Sdk.storage.get();
  }
}

const XummSDK = new XummService();

Object.freeze(XummSDK);

export default XummSDK;
