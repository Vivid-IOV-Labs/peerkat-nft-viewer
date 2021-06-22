<template>
  <div class=" grid grid-cols-2 gap-12">
    <media-card v-for="media in allMedia" :key="media.mediaID" :media="media"></media-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import MediaService from "../services/MediaService"
import MediaCard from "../components/MediaCard.vue"

export default defineComponent({
  components: {
    MediaCard
  },
  setup: () => {
    const allMedia = ref([]);
    onMounted(async () => {
        console.log('mounted in the composition api!')
        allMedia.value = await MediaService.list();
    })
    return {allMedia}
  }
  
})
</script>