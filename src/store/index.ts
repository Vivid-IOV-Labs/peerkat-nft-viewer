import { createStore, createLogger } from "vuex";
import media from "./modules/media";
const store = createStore({
  modules: {
    media,
  },
  strict: true,
  plugins: [createLogger()],
});
export default store;
