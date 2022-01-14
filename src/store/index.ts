import { createStore, createLogger } from "vuex";
import { NftModule } from "./modules/nft";
import { XummModule } from "./modules/xumm";
import { UserModule } from "./modules/user";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    xumm: XummModule,
    nft: NftModule,
    user: UserModule,
  },
  strict: true,
  plugins: [
    createLogger(),
    createPersistedState({
      paths: ["nft.shared", "user"],
    }),
  ],
});
export default store;
