<template>
  <div class="bg-white shadow-lg">
    <div class="w-full rounded-lg overflow-hidden">
      <img
        class="object-contain object-center"
        :src="posterUrl"
        @error="fallbackImg"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: {
    nft: { type: Object, required: true },
  },
  setup: () => {
    return {
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
  computed: {
    posterUrl(): string {
      return this.nft.url;
    },
  },
});
</script>
