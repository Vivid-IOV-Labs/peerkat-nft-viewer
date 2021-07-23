import ApiService from "./ApiService";
import { Media } from "../models/Media";

const API_ENDPOINT = "media";

async function list(): Promise<Array<Media>> {
  const {
    data: { allMedia },
  } = await ApiService.get(`${API_ENDPOINT}/list`);
  return allMedia;
}

async function add(newMedia: Media): Promise<Media> {
  const {
    data: { media },
  } = await ApiService.post(`${API_ENDPOINT}/add`, newMedia);
  return media;
}

async function remove(mediaID: string): Promise<void> {
  await ApiService.delete(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
}

async function find(mediaID: string): Promise<Media> {
  const {
    data: { media },
  } = await ApiService.get(`${API_ENDPOINT}`, {
    params: { mediaID },
  });
  return media;
}

async function update(mediaToUpdate: Media | any): Promise<Media> {
  const { mediaID } = mediaToUpdate;
  const {
    data: { media: updatedMedia },
  } = await ApiService.patch(`${API_ENDPOINT}`, {
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
