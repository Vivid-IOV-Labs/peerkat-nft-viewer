import ApiService from "./ApiService";
import { Media } from "../models/Media";
const API_ENDPOINT = "media";

async function list(): Promise<Array<Media>> {
  const {
    data: { allMedia },
  } = await ApiService.get(`${API_ENDPOINT}/list`);
  console.log(allMedia);
  return allMedia;
}

async function add(newMedia: Media): Promise<void> {
  const { data } = await ApiService.post(`${API_ENDPOINT}/add`, newMedia);
  console.log(data);
}

async function remove(mediaID: string): Promise<void> {
  console.log(mediaID);

  const { data } = await ApiService.delete(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
  console.log(data);
}

export default {
  list,
  add,
  remove,
};
