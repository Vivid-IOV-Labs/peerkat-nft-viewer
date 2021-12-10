const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import type { XummTypes } from "xumm-sdk";

import { xAppOttData } from "xumm-sdk/dist/src/types";
let Sdk: any = null;
function initialize() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { XummSdkJwt } = require("xumm-sdk");
  Sdk = new XummSdkJwt(xummApiKey);
  const redirect = Sdk.xApp.get("redirect");
}
export async function getOttData(): Promise<xAppOttData> {
  if (Sdk) {
    const ottdata = await Sdk.getOttData();
    return ottdata;
  } else {
    initialize();
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
