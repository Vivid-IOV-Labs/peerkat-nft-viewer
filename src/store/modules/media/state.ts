import { Media } from "../../../models/Media";

// interface Pagination {
//   totalItems: number;
//   currentPage: number;
//   itemPerPage: number;
// }
export interface MediaState {
  all: Array<Media>;
  totalItems: number;
}

const state = (): MediaState => ({
  all: [],
  totalItems: 0,
});

export default state;
