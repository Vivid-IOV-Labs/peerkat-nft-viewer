import MediaService from "../../../services/MediaService";
import { ActionTree, Store } from "vuex";
import { Media } from "../../../models/Media";

interface MediaState {
  all: Array<Media>;
}

const actions: ActionTree<Media, MediaState> = {
  async fetchAll({ commit }): Promise<void> {
    const allParams = {
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      pageSize: 120,
    };
    const media = await MediaService.list(allParams);
    commit("setAll", media);
  },
  async add({ commit }, newVideo: Media): Promise<void> {
    const newAddedMedia = await MediaService.add(newVideo);
    commit("add", newAddedMedia);
  },
  async remove({ commit }, mediaID: string): Promise<void> {
    await MediaService.remove(mediaID);
    commit("remove", mediaID);
  },
};
export default actions;
