<template>
  <VueAnnouncer />
  <notifications
    :duration="100000"
    position="bottom center"
    classes="my-notification bg-light"
  />
  <div v-if="withAuthLayout" style="height: 100%">
    <auth-layout>
      <RouterView v-slot="{ Component, route }" name="default">
        <transition
          :key="route.path"
          :name="route.meta.transition"
          mode="out-in"
          :duration="300"
        >
          <Suspense>
            <template #default>
              <div style="height: 100%; display: flex; flex-direction: column">
                <component :is="Component" :key="route.path" />
              </div>
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
        </transition>
      </RouterView>
    </auth-layout>
  </div>
  <div v-else class="container px-6 pt-4 pb-6 h-screen">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

export default defineComponent({
  name: "App",
  components: {
    AuthLayout,
  },
  computed: {
    withAuthLayout() {
      return this.$route.meta.withAuth;
    },
  },
});
</script>
<style>
.my-notification {
  max-width: 350px;
  font-size: 0.875rem;
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
  color: #6c757d;
  background-color: rgba(255, 255, 255, 0.85);
  background-clip: padding-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.notification-content {
  padding: 0.75rem;
}
.success {
  background: #68cd86;
  border-left-color: #42a85f;
}

.warn {
  background: #ffb648;
  border-left-color: #f48a06;
}

.error {
  background: #e54d42;
  border-left-color: #b82e24;
}
</style>
