import { MutationTree } from "vuex";
import { Media } from "../../../models/Media";
import { MediaState } from "../media/state";

const mutations: MutationTree<MediaState> = {
  setAll(state: MediaState, all: Array<Media>): void {
    state.all = all;
  },
  setTotalItems(state: MediaState, total: number): void {
    state.totalItems = total;
  },
  add(state: MediaState, newMedia: Media): void {
    state.all = [newMedia, ...state.all];
  },
  remove(state: MediaState, mediaID: string): void {
    state.all = state.all.filter((media) => media.mediaID !== mediaID);
  },
};

export default mutations;
