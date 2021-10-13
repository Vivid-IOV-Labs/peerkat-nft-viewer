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
                class="
                  top-0
                  right-0
                  h-screen
                  w-screen
                  z-50
                  flex
                  justify-center
                  items-center
                "
              >
                <div
                  class="
                    animate-spin
                    rounded-full
                    h-32
                    w-32
                    border-t-2 border-b-2 border-green-700
                  "
                ></div>
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
