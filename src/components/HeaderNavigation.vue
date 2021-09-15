<template>
  <div class="sticky top-0 z-50 flex-1 flex flex-col">
    <nav
      :class="{
        'bg-green-500': isBrandWorker(),
        'bg-green-800': isBrandManager(),
        'bg-red-800': isAdminWorker(),
        'bg-pink-800': isPublic(),
      }"
      class="px-4 flex justify-between h-16 shadow"
    >
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
/**
 Brand worker - lighter shade of the peerkat green
Brand manager - darker shade of the peerkat green
Admin worker - purple
Public User - amber
 */
const apiUrl = import.meta.env.VITE_API_URL;
const isProduction =
  apiUrl == "https://media.peerkat.live" ||
  apiUrl == "https://vivid-media.herokuapp.com";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";

function getUserRole() {
  return localStorage.getItem("user-role");
}
function isBrandWorker() {
  return getUserRole() == "brand/worker";
}
function isBrandManager() {
  return getUserRole() == "brand/manager";
}
function isAdminWorker() {
  return getUserRole() == "admin/manager";
}
function isPublic() {
  return getUserRole() == "public";
}

export default defineComponent({
  components: {
    BaseButton,
  },
  setup: () => {
    const route = useRoute();
    const router = useRouter();
    const title = computed(() => route.meta.title);
    console.log(isBrandWorker());
    return {
      isProduction,
      title,
      route,
      isBrandWorker,
      isBrandManager,
      isAdminWorker,
      isPublic,
      logOut() {
        localStorage.removeItem("token");
        router.push({ path: "/" });
      },
    };
  },
});
</script>
