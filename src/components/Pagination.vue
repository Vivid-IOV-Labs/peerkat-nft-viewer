<template>
  <div class="flex justify-center items-center space-x-1 w-full">
    <a
      href="#"
      class="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md"
      :class="{
        'hover:bg-green-400 hover:text-white font-bold ': currentPage > 1,
      }"
      @click.stop.prevent="prev()"
    >
      Previous
    </a>
    <a
      v-for="page in pages"
      :key="page"
      href="#"
      class="
        px-4
        py-2
        bg-gray-300
        rounded-md
        hover:bg-green-400 hover:text-white
      "
      :class="{
        'bg-green-400 text-white': page == currentPage,
        'text-gray-700bg-gray-200': page != currentPage,
      }"
      @click.stop.prevent="setCurrentPage(page)"
    >
      {{ page }}
    </a>
    <a
      href="#"
      class="px-4 py-2 text-gray-500 bg-gray-300 rounded-md"
      :class="{
        'hover:bg-green-400 hover:text-white font-bold ':
          currentPage < pages.length,
      }"
      @click.stop.prevent="next()"
    >
      Next
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const total = computed(() => store.getters["media/getTotal"]);
    const pageSize = route.query.pageSize ? Number(route.query.pageSize) : 5;
    const pages = computed(() => {
      const numberOfPages = Math.ceil(total.value / pageSize);
      return [...Array(numberOfPages).keys()].map((i) => i + 1);
    });
    const currentPage = computed({
      get(): number {
        return Number(route.query.page);
      },
      set(newVal: number): void {
        router.push({
          path: "/media",
          replace: true,
          query: { ...route.query, ...{ page: newVal } },
        });
      },
    });

    return {
      pages,
      currentPage,
      setCurrentPage(page: number) {
        currentPage.value = page;
      },
      prev() {
        if (currentPage.value > 1) {
          currentPage.value -= 1;
        }
      },
      next() {
        if (currentPage.value < pages.value.length) {
          currentPage.value += 1;
        }
      },
    };
  },
});
</script>
