const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
const xummApiSecret = import.meta.env.VITE_XUMM_API_SECRET as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";

let Sdk: any = null;

class XummService {
  constructor() {
    if (Sdk) {
      throw new Error("You can only create one instance!");
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { XummSdkJwt } = require("xumm-sdk");
    Sdk = new XummSdkJwt(xummApiKey, xummApiSecret);
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
