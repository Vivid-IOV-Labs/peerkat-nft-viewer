<template>
  <div class="sticky top-0 z-50 flex-1 flex flex-col">
    <nav class="px-4 flex justify-between bg-white h-16 shadow">
      <!-- top bar left -->
      <ul class="flex items-center">
        <!-- add button -->
        <li class="h-12 w-12 mr-2">
          <img
            class="h-full w-full mx-auto"
            src="@/assets/img/logopeerkat.png"
            alt="Peerkat logo"
          />
        </li>
        <li class="mr-2">
          <span v-if="isProduction" class="text-lg uppercase font-bold"
            >Production</span
          >
          <span v-else class="text-lg uppercase font-bold">Test</span>
        </li>
      </ul>

      <ul class="flex items-center">
        <!-- add button -->
        <li>
          <h1 class="pl-8 lg:pl-0 uppercase font-semibold text-lg">
            {{ title }}
          </h1>
        </li>
      </ul>

      <!-- to bar right  -->
      <div class="flex items-center">
        <base-button
          v-if="route.path == '/media'"
          class="pr-6 uppercase text-lg ml-2"
          @click="logOut"
        >
          LOGOUT
        </base-button>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction =
  apiUrl == "https://media.peerkat.live" ||
  apiUrl == "https://vivid-media.herokuapp.com";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";

export default defineComponent({
  components: {
    BaseButton,
  },
  setup: () => {
    const route = useRoute();
    const router = useRouter();
    const title = computed(() => route.meta.title);
    return {
      isProduction,
      title,
      route,
      logOut() {
        localStorage.removeItem("token");
        router.push({ path: "/" });
      },
    };
  },
});
</script>
