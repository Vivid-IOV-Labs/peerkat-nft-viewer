<template>
  <div class="flex-1 flex flex-col">
    <nav class="px-4 flex justify-between bg-white h-16 shadow">
      <!-- top bar left -->
      <ul class="flex items-center">
        <!-- add button -->
        <li class="h-12 w-12 mr-2">
          <img
            class="h-full w-full mx-auto"
            src="@/assets/img/logopeerkat.png"
            alt="svelte logo"
          />
        </li>
      </ul>

      <ul class="flex items-center">
        <!-- add button -->
        <li>
          <h1 class="pl-8 lg:pl-0 font-semibold text-xl">{{ title }}</h1>
        </li>
      </ul>

      <!-- to bar right  -->
      <ul class="flex items-center">
        <li class="pr-6">
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-bell"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg> -->
        </li>
      </ul>
    </nav>
  </div>
</template>
<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup: () => {
    const route = useRoute();
    const title = computed(() => route.meta.title);
    return { title };
  },
});
</script>
