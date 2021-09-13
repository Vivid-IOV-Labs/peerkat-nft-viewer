import ApiService from "./ApiService";
import { NFT } from "../models/NFT";

const API_ENDPOINT = "nft";

function serialized(params: Record<string, string | number>): string {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
}
interface listResponse {
  media: NFT[];
  total: number;
}
interface ResponseNFT {
  nft: NFT;
}

async function list(
  params: Record<string, string | number>
): Promise<listResponse> {
  const {
    data: { allNFT: media, totalNFT: total },
  } = await ApiService.get(`${API_ENDPOINT}?${serialized(params)}`);
  return { media, total };
}

async function create(newMedia: NFT["details"]): Promise<unknown> {
  const {
    data: { media },
  } = await ApiService.post(`${API_ENDPOINT}`, newMedia);
  return media;
}

async function approve(NFT: NFT): Promise<ResponseNFT> {
  const {
    data: { nft: approvedNFT },
  } = await ApiService.post(`${API_ENDPOINT}/approve`, NFT);
  console.log(approvedNFT);
  debugger;
  return approvedNFT;
}

async function issue(NFT: NFT): Promise<ResponseNFT> {
  const {
    data: { nft: issuedNFT },
  } = await ApiService.post(`${API_ENDPOINT}/issue`, NFT);
  console.log(issuedNFT);
  debugger;
  return issuedNFT;
}

async function claim(NFT: NFT): Promise<ResponseNFT> {
  const {
    data: { nft: claimedNFT },
  } = await ApiService.post(`${API_ENDPOINT}/claim`, NFT);
  console.log(claimedNFT);
  debugger;
  return claimedNFT;
}

async function remove(mediaID: string): Promise<void> {
  await ApiService.delete(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
}

async function find(mediaID: string): Promise<NFT> {
  const {
    data: { media },
  } = await ApiService.get(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
  return media;
}

async function update(mediaToUpdate: NFT): Promise<NFT> {
  const {
    data: { media: updatedMedia },
  } = await ApiService.patch(`${API_ENDPOINT}`, {
    ...mediaToUpdate,
  });
  return updatedMedia;
}

export default {
  list,
  create,
  approve,
  remove,
  find,
  update,
  issue,
  claim,
};
