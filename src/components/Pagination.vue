<template>
  <div class="flex items-center space-x-1">
    <a
      href="#"
      class="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md"
      :class="{
        'hover:bg-blue-400 hover:text-white': currentPage > 1,
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
        text-gray-700
        bg-gray-200
        rounded-md
        hover:bg-blue-400 hover:text-white
      "
      :class="{ 'bg-blue-400 text-white': page == currentPage }"
      @click.stop.prevent="setCurrentPage(page)"
    >
      {{ page }}
    </a>
    <a
      href="#"
      class="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md"
      :class="{
        'hover:bg-blue-400 hover:text-white': currentPage < pages.length,
      }"
      @click.stop.prevent="next()"
    >
      Next
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  props: {
    itemsPerPage: {
      type: Number,
      default: () => 4,
    },
  },
  setup: (props) => {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const currentPage = ref<number>(1);
    const total = computed(() => store.getters["media/getTotal"]);
    const pageSize = route.query.pageSize ? Number(route.query.pageSize) : 5;
    const pages = computed(() => {
      const numberOfPages = Math.ceil(total.value / pageSize);
      return [...Array(numberOfPages).keys()].map((i) => i + 1);
    });

    watch(currentPage, (currentPage) => {
      router.push({
        path: "/media",
        replace: true,
        query: { ...route.query, ...{ page: currentPage } },
      });
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
