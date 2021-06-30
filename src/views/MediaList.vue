<template>
  <div class="flex justify-center items-center">
    <base-input
      v-model="searchByTitle"
      placeholder="Search by title"
      type="search"
      class="w-full max-w-xl"
    ></base-input>
  </div>
  <div class="mt-4 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <media-card
      v-for="media in allMedia"
      :key="media.mediaID"
      :media="media"
    ></media-card>
    <router-link
      class="
        w-20
        h-20
        bg-green-400
        hover:bg-green-700
        focus:ring
        ring-offset-2
        text-white
        font-bold
        rounded-full
        flex
        items-center
        justify-center
        fixed
        bottom-10
        right-10
      "
      :to="{ path: '/media/add' }"
      >Add New</router-link
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import MediaCard from "../components/MediaCard.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    MediaCard,
    BaseInput,
  },
  setup: () => {
    const store = useStore();
    const searchByTitle = ref("");
    const allMedia = computed(() => {
      console.log(searchByTitle.value);
      return store.getters["media/byTitle"](searchByTitle.value);
    });
    store.dispatch("media/fetchAll");
    return { allMedia, searchByTitle };
  },
});
</script>
