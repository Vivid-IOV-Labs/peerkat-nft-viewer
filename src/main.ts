// if (!isInXumm && process.env.NODE_ENV === "production") {
//   window.location.replace("https://www.vividiov.com/peerkat");
// }
import { createApp, h, Fragment } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
import VueAxe, { VueAxePopup } from "vue-axe";
import VueAnnouncer from "@vue-a11y/announcer";
import Notifications from "@kyvg/vue3-notification";
const isInXumm = /xumm/.test(navigator.userAgent);

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
    .provide("isInXumm", isInXumm)
    .mount("#app");
} else {
  createApp(App)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .provide("isInXumm", isInXumm)
    .mount("#app");
}

// const hours = 1; // Reset when storage is more than 24hours
// const now = new Date().getTime();
// const setupTime = Number(localStorage.getItem("setupTime"));
// if (setupTime == null) {
//   localStorage.setItem("setupTime", now.toString());
// } else {
//   if (now - setupTime > hours * 60 * 60 * 1000) {
//     localStorage.clear();
//     localStorage.setItem("setupTime", now.toString());
//   }
// }
// function messageHandler(event: any) {
//   console.log(event.data);
// }

// if (typeof window.addEventListener === "function") {
//   window.addEventListener("message", messageHandler);
// }
// if (typeof document.addEventListener === "function") {
//   document.addEventListener("message", messageHandler);
// }
