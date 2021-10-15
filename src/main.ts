import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
import VueAxe from "vue-axe";

if (process.env.NODE_ENV === "development") {
  createApp(App)
    .use(router)
    .use(store)
    .use(i18n)
    .use(VueAxe.default)
    .mount("#app");
} else {
  createApp(App).use(router).use(store).use(i18n).mount("#app");
}
