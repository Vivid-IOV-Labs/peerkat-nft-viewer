<template>
  <div>
    <VueAnnouncer />
    <notifications
      position="bottom center"
      width="100%"
      classes="my-notification bg-dark"
    />
    <div v-if="withAuthLayout">
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
                <main class="container">
                  <LoadTranslations></LoadTranslations>

                  <component :is="Component" :key="route.path" />
                </main>
              </template>
              <template #fallback>
                <div
                  style="
                    height: 100%;
                    width: 100%;
                    position: fixed;
                    opacity: 0.8;
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import LoadTranslations from "@/i18n/LoadTranslations.vue";

export default defineComponent({
  name: "App",
  components: {
    AuthLayout,
    LoadTranslations,
  },
  computed: {
    withAuthLayout() {
      return this.$route.meta.withAuth;
    },
  },
});
</script>
<style scoped>
.my-notification {
  overflow: hidden;
  font-size: 0.875rem;
  text-align: center;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  opacity: 0;
  border-radius: 0.25rem;
}
.my-notification .notification-title {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding: 0.25rem 0.75rem;
  color: #fff;
  text-align: center;
  background-clip: padding-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.my-notification .notification-content {
  padding: 0.75rem;
  color: #fff;
  text-align: center;
}
</style>
