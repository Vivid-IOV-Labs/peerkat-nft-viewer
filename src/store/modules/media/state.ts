import { Media } from "../../../models/Media";

export interface MediaState {
  all: Array<Media>;
  filters: Media;
}

const state = (): MediaState => ({
  all: [],
  filters: {},
});

export default state;
