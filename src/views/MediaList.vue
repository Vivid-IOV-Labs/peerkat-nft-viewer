<template>
  <div class="flex flex-col justify-center items-center mb-2">
    <base-input
      id="search"
      v-model="searchByTitle"
      placeholder="Search by title"
      type="search"
      label-text=""
      class="w-full max-w-xl"
    ></base-input>
    <div class="flex w-full mt-3 mb-8"><filters></filters></div>
  </div>

  <div class="mt-2 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <media-card
      v-for="media in allMedia"
      :key="media.mediaID"
      :media="media"
    ></media-card>
    <router-link
      class="
        w-16
        h-16
        bg-red-500
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
  <!-- <div class="flex w-full py-4 mt-6"><pagination></pagination></div> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import MediaCard from "../components/MediaCard.vue";
import BaseInput from "@/components/BaseInput.vue";
// import Pagination from "@/components/Pagination.vue";
import Filters from "@/components/Filters.vue";
import { useStore } from "vuex";
import { PlusIcon } from "@heroicons/vue/solid";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    MediaCard,
    BaseInput,
    PlusIcon,
    // Pagination,
    Filters,
  },
  setup: () => {
    const store = useStore();
    const route = useRoute();

    const searchByTitle = ref("");
    const allMedia = computed(() => {
      return store.getters["nft/byTitle"](searchByTitle.value);
    });
    store.dispatch("nft/fetchAll", route.query);
    watch(
      () => route.query,
      async () => {
        await store.dispatch("nft/fetchAll", route.query);
      }
    );
    return { allMedia, searchByTitle };
  },
});
</script>
