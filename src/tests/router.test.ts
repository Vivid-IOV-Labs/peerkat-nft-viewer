import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

import App from "../App.vue";
import Welcome from "../views/Welcome.vue";
import { describe, test, expect } from "vitest";

describe("App", () => {
  test("renders a component via routing", async () => {
    // create local router
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/welcome",
          name: "Welcome",
          component: Welcome,
        },
      ],
    });

    // navigate to route
    router.push("/welcome");

    // await navigation from push()
    await router.isReady();

    // install the local router
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findComponent(Welcome).exists()).toBe(true);
  });
});
