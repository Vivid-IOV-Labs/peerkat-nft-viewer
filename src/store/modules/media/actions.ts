import MediaService from "../../../services/MediaService";
import { ActionTree } from "vuex";
import { Media } from "../../../models/Media";

interface MediaState {
  all: Array<Media>;
}

const actions: ActionTree<Media, MediaState> = {
  async fetchAll({ commit }, params): Promise<void> {
    const { media, total } = await MediaService.list(params);
    commit("setAll", media);
    commit("setTotalItems", total);
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
