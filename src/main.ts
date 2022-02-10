const isInXumm = /xumm/.test(navigator.userAgent);
const xummSandbox = import.meta.env.VITE_XUMM_SANBDOX;

localStorage.removeItem("vuex");
if (!isInXumm && xummSandbox === "main") {
  window.location.replace("https://www.peerkat.io/");
}

import { createApp, h, Fragment } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
import VueAxe, { VueAxePopup } from "vue-axe";
import VueAnnouncer from "@vue-a11y/announcer";
import Notifications from "@kyvg/vue3-notification";

import VueLazyLoad from "vue3-lazyload";
import { trackInit } from "./utils/analytics";

trackInit();
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
    .use(VueLazyLoad, {
      loading: "loading.gif",
      error: "thumbnail.jpg",
    })
    .provide("isInXumm", isInXumm)
    .mount("#app");
} else {
  createApp(App)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .use(VueLazyLoad, {
      loading: "loading.gif",
      error: "thumbnail.jpg",
    })
    .provide("isInXumm", isInXumm)
    .mount("#app");
}
