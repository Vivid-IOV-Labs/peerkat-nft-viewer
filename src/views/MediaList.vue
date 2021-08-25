<template>
  <div class="flex flex-col justify-center items-center">
    <base-input
      v-model="searchByTitle"
      placeholder="Search by title"
      type="search"
      class="w-full max-w-xl"
    ></base-input>
    <div class="flex py-4"><pagination></pagination></div>
    <div class="flex py-4"><filters></filters></div>
  </div>

  <div class="mt-4 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <media-card
      v-for="media in allMedia"
      :key="media.mediaID"
      :media="media"
    ></media-card>
    <router-link
      class="
        w-16
        h-16
        bg-green-500
        text-white
        font-bolder
        text-3xl
        rounded-full
        flex
        items-center
        justify-center
        fixed
        bottom-10
        right-10
        shadow-xl
      "
      :to="{ path: '/media/add' }"
    >
      <PlusIcon class="h-8 w-8 text-white" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import MediaCard from "../components/MediaCard.vue";
import BaseInput from "@/components/BaseInput.vue";
import Pagination from "@/components/Pagination.vue";
import Filters from "@/components/Filters.vue";
import { useStore } from "vuex";
import { PlusIcon } from "@heroicons/vue/solid";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    MediaCard,
    BaseInput,
    PlusIcon,
    Pagination,
    Filters,
  },
  setup: () => {
    const store = useStore();
    const route = useRoute();

    const searchByTitle = ref("");
    const allMedia = computed(() => {
      return store.getters["media/byTitle"](searchByTitle.value);
    });
    store.dispatch("media/fetchAll", route.query);
    watch(
      () => route.query,
      async () => {
        await store.dispatch("media/fetchAll", route.query);
      }
    );
    return { allMedia, searchByTitle };
  },
});
</script>
