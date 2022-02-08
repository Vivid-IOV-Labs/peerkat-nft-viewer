import { createStore, createLogger } from "vuex";
import { NftModule } from "./modules/nft";
import { XummModule } from "./modules/xumm";
import { UserModule } from "./modules/user";
import { UiModule } from "./modules/ui";
import createPersistedState from "vuex-persistedstate";
const xummSandbox = import.meta.env.VITE_XUMM_SANDBOX;
const store = createStore({
  modules: {
    user: UserModule,
    ui: UiModule,
    xumm: XummModule,
    nft: NftModule,
  },
  strict: process.env.NODE_ENV !== "production",
  plugins:
    xummSandbox == "main"
      ? [
          createPersistedState({
            paths: ["nft.sharedwithme", "user"],
          }),
        ]
      : [
          createLogger(),
          createPersistedState({
            paths: ["nft.sharedwithme", "user"],
          }),
        ],
});
export default store;
