<template>
  <div class="border bg-white shadow-lg">
    <div class="w-full rounded-lg h-60 overflow-hidden">
      <img
        class="object-cover' object-center h-full w-full"
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
