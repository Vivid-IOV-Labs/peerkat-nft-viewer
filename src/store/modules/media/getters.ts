import { MediaState } from "./state";
import { Media } from "../../../models/Media";

export default {
  getAll: (state: MediaState): Array<Media> => state.all,
  find:
    (state: MediaState) =>
    (mediaID: string): Media | undefined => {
      return state.all.find((media) => media.mediaID === mediaID);
    },
  byTitle:
    (state: MediaState) =>
    (title: string): Array<Media> => {
      if (title) {
        return state.all.filter((media) => {
          const searchParams = title
            .toLocaleLowerCase()
            .trim()
            .split(" ")
            .join(".*$/|^.*");
          const searchString = `^.*${searchParams}.*$`;
          const normalizedTitle = media.details.title
            .toLocaleLowerCase()
            .trim();
          return new RegExp(searchString).test(normalizedTitle);
        });
      } else {
        return state.all;
      }
    },
};
