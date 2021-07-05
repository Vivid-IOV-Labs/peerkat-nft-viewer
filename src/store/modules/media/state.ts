import { Media } from "../../../models/Media";

export interface MediaState {
  all: Array<Media>;
}

const state = (): MediaState => ({
  all: [],
});

export default state;
