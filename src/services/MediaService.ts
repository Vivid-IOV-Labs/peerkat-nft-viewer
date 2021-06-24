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

async function add(newMedia: Media): Promise<Media> {
  const {
    data: { media },
  } = await ApiService.post(`${API_ENDPOINT}/add`, newMedia);
  return media;
}

async function remove(mediaID: string): Promise<void> {
  console.log(mediaID);
  const { data } = await ApiService.delete(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
  console.log(data);
}

async function find(mediaID: string): Promise<Media> {
  const {
    data: { media },
  } = await ApiService.get(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
  return media;
}

async function update(mediaToUpdate: Media): Promise<Media> {
  const { mediaID } = mediaToUpdate;
  const {
    data: { media: updatedMedia },
  } = await ApiService.put(`${API_ENDPOINT}`, {
    params: { mediaID },
    ...mediaToUpdate,
  });
  return updatedMedia;
}

export default {
  list,
  add,
  remove,
  find,
  update,
};
