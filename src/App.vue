<template>
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
              <div>
                <component :is="Component" :key="route.path" />
              </div>
            </template>
            <template #fallback>
              <div
                style="height: 100%; width: 100%"
                class="d-flex align-items-center justify-content-center"
              >
                <div
                  class="spinner-border"
                  style="width: 4rem; height: 4rem"
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
