<template>
  <router-link :to="{ path: '/media/add' }">Add New</router-link>
  <div class="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <media-card
      v-for="media in allMedia"
      :key="media.mediaID"
      :media="media"
    ></media-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import MediaCard from "../components/MediaCard.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    MediaCard,
  },
  setup: () => {
    const store = useStore();
    const allMedia = computed(() => store.getters["media/filtered"]());
    store.dispatch("media/fetchAll");
    return { allMedia };
  },
});
</script>
