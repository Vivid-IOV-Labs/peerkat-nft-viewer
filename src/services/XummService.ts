const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;

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
