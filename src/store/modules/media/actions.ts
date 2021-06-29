import MediaService from "../../../services/MediaService";
import { Store } from "vuex";
import { Media } from "../../../models/Media";

interface MediaState {
  all: Array<Media>;
}
export default {
  async fetchAll({ commit }: Store<MediaState>): Promise<void> {
    const media = await MediaService.list();
    commit("setAll", media);
  },
  async add({ commit }: Store<MediaState>, newVideo: Media): Promise<void> {
    const newAddedMedia = await MediaService.add(newVideo);
    commit("add", newAddedMedia);
  },
  async remove({ commit }: Store<MediaState>, mediaID: string): Promise<void> {
    await MediaService.remove(mediaID);
    commit("remove", mediaID);
  },
};
