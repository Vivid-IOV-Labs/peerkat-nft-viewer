import { Media } from "../../../models/Media";

interface MediaState {
  all: Array<Media>;
}
export default {
  setAll(state: MediaState, all: Array<Media>): void {
    state.all = all;
  },
  add(state: MediaState, newMedia: Media): void {
    state.all = [newMedia, ...state.all];
  },
  remove(state: MediaState, mediaID: string): void {
    state.all.filter((media) => media.mediaID !== mediaID);
  },
};
