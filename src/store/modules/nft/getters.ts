import { NFTState } from "./state";
interface NFT {
  url: string;
  issuer: string;
  currency: string;
}
export default {
  getAll: (state: NFTState): Array<NFT> => state.all,
  getTotal: (state: NFTState): number => state.totalItems,
  getQuery: (state: NFTState): Record<string, string | number> => state.query,
  getByAddress:
    (state: NFTState) =>
    (address: string): NFT | undefined => {
      return state.all.find(({ issuer }) => issuer == address);
    },
  // byTitle:
  //   (state: NFTState) =>
  //   (title: string): Array<NFT> => {
  //     if (title) {
  //       return state.all.filter((media) => {
  //         const searchParams = title
  //           .toLocaleLowerCase()
  //           .trim()
  //           .split(" ")
  //           .join(".*$/|^.*");
  //         const searchString = `^.*${searchParams}.*$`;
  //         const normalizedTitle = media.details.title
  //           .toLocaleLowerCase()
  //           .trim();
  //         return new RegExp(searchString).test(normalizedTitle);
  //       });
  //     } else {
  //       return state.all;
  //     }
  //   },
};
