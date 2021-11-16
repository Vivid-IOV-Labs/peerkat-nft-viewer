import { createApp, h, Fragment } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
import VueAxe, { VueAxePopup } from "vue-axe";
import VueAnnouncer from "@vue-a11y/announcer";
import Notifications from "@kyvg/vue3-notification";

if (process.env.NODE_ENV === "development") {
  createApp({
    render: () => h(Fragment, [h(App), h(VueAxePopup)]),
  })
    .use(VueAxe)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .mount("#app");
} else {
  createApp(App)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .mount("#app");
}
