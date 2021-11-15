import { OttData } from "../../../models/OttData";

export interface XummState {
  OttData: OttData | null;
}

const state = (): XummState => ({
  OttData: null,
});

export default state;
