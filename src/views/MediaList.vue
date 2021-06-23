<template>
  <router-link :to="{ path: '/media/add' }">Add New</router-link>
  <div class="grid grid-cols-3 gap-12">
    <media-card
      v-for="media in allMedia"
      :key="media.mediaID"
      :media="media"
    ></media-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MediaService from "../services/MediaService";
import MediaCard from "../components/MediaCard.vue";
import { Media } from "../models/Media";

export default defineComponent({
  components: {
    MediaCard,
  },
  setup: () => {
    const allMedia = ref<Media[]>([]);
    onMounted(async () => {
      const result = await MediaService.list();
      allMedia.value = result;
    });
    return { allMedia };
  },
});
</script>
