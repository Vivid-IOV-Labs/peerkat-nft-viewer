import { createStore, createLogger } from "vuex";
import { NftModule } from "./modules/nft";
import { XummModule } from "./modules/xumm";

const store = createStore({
  modules: {
    xumm: XummModule,
    nft: NftModule,
  },
  strict: true,
  plugins: [createLogger()],
});
export default store;
