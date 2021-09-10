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
async function list(
  params: Record<string, string | number>
): Promise<listResponse> {
  const {
    data: { allNFT: media, totalNFT: total },
  } = await ApiService.get(`${API_ENDPOINT}?${serialized(params)}`);
  return { media, total };
}

async function create(newMedia: NFT): Promise<unknown> {
  const {
    data: { media },
  } = await ApiService.post(`${API_ENDPOINT}`, newMedia);
  return media;
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
  remove,
  find,
  update,
};
