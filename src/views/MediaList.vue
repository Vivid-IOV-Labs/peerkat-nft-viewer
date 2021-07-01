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
import { defineComponent, computed, ref } from "vue";
import MediaCard from "../components/MediaCard.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useStore } from "vuex";
import { PlusIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    MediaCard,
    BaseInput,
    PlusIcon,
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
