import { Media } from "../../../models/Media";

export interface MediaState {
  all: Array<Media>;
  totalItems: number;
  query: Record<string, string | number>;
}

const state = (): MediaState => ({
  all: [],
  totalItems: 0,
  query: {},
});

export default state;
