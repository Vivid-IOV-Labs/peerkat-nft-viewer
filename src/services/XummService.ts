const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";
let Sdk: any = null;
function initialize() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { XummSdkJwt } = require("xumm-sdk");
  Sdk = new XummSdkJwt(xummApiKey);
}
export async function getOttData(): Promise<xAppOttData> {
  if (Sdk) {
    console.log("calling sdk getOttdata");
    const ottdata = await Sdk.getOttData();
    return ottdata;
  } else {
    initialize();
    console.log("calling sdk getOttdata");
    const ottdata = await Sdk.getOttData();
    return ottdata;
  }
}

export async function createPaylod(
  newPayload: XummTypes.CreatePayload
): Promise<any> {
  if (Sdk) {
    const created = await Sdk.payload.create(newPayload);

    return created;
  } else {
    initialize();
    const created = await Sdk.payload.create(newPayload);

    return created;
  }
}
