<template>
  <VueAnnouncer />
  <notifications :duration="1000" position="bottom center" />
  <div
    v-if="isLoading"
    style="
      height: 100%;
      width: 100%;
      position: absolute;
      opacity: 0.8;
      top: 0;
      left: 0;
    "
    class="d-flex align-items-center justify-content-center"
  >
    <div
      class="spinner-border"
      style="width: 4rem; height: 4rem; color: #666"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div style="height: 100%">
    <!-- <Suspense>
      <template #default> -->

    <auth-layout>
      <RouterView v-slot="{ Component, route }" name="default">
        <transition
          :key="route.path"
          :name="route.meta.transition"
          mode="out-in"
          :duration="300"
        >
          <keep-alive>
            <Suspense>
              <template #default>
                <main-loader>
                  <component :is="Component" :key="route.path" />
                </main-loader>
              </template>
              <template #fallback>
                <div
                  style="
                    height: 100%;
                    width: 100%;
                    position: absolute;
                    opacity: 0.8;
                    top: 0;
                    left: 0;
                  "
                  class="d-flex align-items-center justify-content-center"
                >
                  <div
                    class="spinner-border"
                    style="width: 4rem; height: 4rem; color: #666"
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </template>
            </Suspense>
          </keep-alive>
        </transition>
      </RouterView>
    </auth-layout>

    <!-- </template>
      <template #fallback>
        <div
          style="
            height: 100%;
            width: 100%;
            position: absolute;
            opacity: 0.8;
            top: 0;
            left: 0;
          "
          class="d-flex align-items-center justify-content-center"
        >
          <div
            class="spinner-border"
            style="width: 4rem; height: 4rem; color: #666"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </template>
    </Suspense> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLoader from "@/layouts/MainLoader.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    AuthLayout,
    MainLoader,
  },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.getters["ui/getIsloading"]);
    return { isLoading };
  },
});
</script>
<style>
/* .my-notification {
  max-width: 350px;
  font-size: 1rem;
  margin: 1rem;
  background-color: rgba(255, 255, 255, 0.85);
  background-clip: padding-box;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 0.25rem;
  border-left-width: 4px;
}
body .my-notification .notification-title {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding: 0.25rem 0.75rem;
  color: #fff;
  background-color: transparent;
  background-clip: padding-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
} */
/* .notification-content {
  padding: 0.75rem;
} */
.success {
  background: #3052ff !important;
  border-left-color: #3052ff !important;
}

.warn {
  background: #ffb648;
  border-left-color: #f48a06;
}

.error {
  background: #e54d42;
  border-left-color: #b82e24;
}
video[poster] {
  object-fit: cover;
  height: 100%;
  object-position: center top;
}
</style>
