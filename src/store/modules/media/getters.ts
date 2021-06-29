import { MediaState } from "./state";
import { Media } from "../../../models/Media";

interface SerachParams {
  key: keyof Media;
  value: string | number;
}

export default {
  getAll: (state: MediaState): Array<Media> => state.all,
  find:
    (state: MediaState) =>
    (mediaID: string): Media | undefined => {
      return state.all.find((media) => media.mediaID === mediaID);
    },
  filtered:
    (state: MediaState) =>
    (searchParams: SerachParams | null): Array<Media> => {
      if (searchParams) {
        const { key, value } = searchParams;
        return state.all.filter((media) => media[key] === value);
      } else {
        return state.all;
      }
    },
};
