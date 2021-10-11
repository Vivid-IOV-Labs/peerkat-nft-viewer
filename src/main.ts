import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";

createApp(App).use(router).use(store).use(i18n).mount("#app");
