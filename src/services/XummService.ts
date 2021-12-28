const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";
// let Sdk: any = null;
// function initialize() {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const { XummSdkJwt } = require("xumm-sdk");
//   Sdk = new XummSdkJwt(xummApiKey);
//   const redirect = Sdk.xApp.get("redirect");
// }
// export async function getOttData(): Promise<xAppOttData> {
//   if (Sdk) {
//     const ottdata = await Sdk.getOttData();
//     return ottdata;
//   } else {
//     initialize();
//     const ottdata = await Sdk.getOttData();
//     return ottdata;
//   }
// }

// export async function createPaylod(
//   newPayload: XummTypes.CreatePayload
// ): Promise<any> {
//   if (Sdk) {
//     const created = await Sdk.payload.create(newPayload);

//     return created;
//   } else {
//     initialize();
//     const created = await Sdk.payload.create(newPayload);

//     return created;
//   }
// }

// export async function saveToStorage(toStore: any) {
//   if (Sdk) {
//     await Sdk.storage.set(toStore);
//   } else {
//     initialize();
//     await Sdk.storage.set(toStore);
//   }
// }

// export async function getStorage() {
//   if (Sdk) {
//     return await Sdk.storage.get();
//   } else {
//     initialize();
//     return await Sdk.storage.get();
//   }
// }

let Sdk: any = null;

class XummService {
  constructor() {
    if (Sdk) {
      throw new Error("You can only create one instance!");
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { XummSdkJwt } = require("xumm-sdk");
    Sdk = new XummSdkJwt(xummApiKey);
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
