import { NFTState } from "./state";
import { NFT } from "../../../models/NFT";

export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getTotal: (state: NFTState): number => state.totalItems,
  getQuery: (state: NFTState): Record<string, string | number> => state.query,
  byTitle:
    (state: NFTState) =>
    (title: string): Array<NFT> => {
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
