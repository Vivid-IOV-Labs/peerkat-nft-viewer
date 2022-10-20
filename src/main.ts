const xummSandbox = import.meta.env.VITE_XUMM_SANBDOX;

if (!isInXumm && xummSandbox === "main") {
  window.location.replace("https://www.peerkat.io/");
}

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Notifications from "@kyvg/vue3-notification";

import VueLazyLoad from "vue3-lazyload";
import { isInXumm } from "./utils/isInXumm";

if (process.env.NODE_ENV === "development") {
  createApp(App)
    .use(router)
    .use(store)
    .use(Notifications)
    .use(VueLazyLoad, {
      loading: "/loading.gif",
      error: "/thumbnail.jpg",
    })
    .provide("isInXumm", isInXumm())
    .mount("#app");
} else {
  createApp(App)
    .use(router)
    .use(store)
    .use(Notifications)
    .use(VueLazyLoad, {
      loading: "/loading.gif",
      error: "/thumbnail.jpg",
    })
    .provide("isInXumm", isInXumm())
    .mount("#app");
}
