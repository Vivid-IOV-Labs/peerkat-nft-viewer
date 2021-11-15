const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;
import { XummSdkJwt, XummTypes } from "xumm-sdk";
const Sdk = new XummSdkJwt(xummApiKey);

export async function getOttData() {
  const ottdata = await Sdk.getOttData();
  return ottdata;
}
