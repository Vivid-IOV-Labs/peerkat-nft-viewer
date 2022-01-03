import { createStore, createLogger } from "vuex";
import { NftModule } from "./modules/nft";
import { XummModule } from "./modules/xumm";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    xumm: XummModule,
    nft: NftModule,
  },
  strict: true,
  plugins: [
    createLogger(),
    createPersistedState({
      paths: ["nft.shared"],
    }),
  ],
});
export default store;
