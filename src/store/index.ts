import { createStore, createLogger } from "vuex";
import nft from "./modules/nft";
const store = createStore({
  modules: {
    nft,
  },
  strict: true,
  plugins: [createLogger()],
});
export default store;
