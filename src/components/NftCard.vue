<template>
  <div class="bg-white shadow-lg rounded-b-lg">
    <div class="w-full rounded-t-lg overflow-hidden">
      <img
        class="object-contain object-center"
        :src="posterUrl"
        @error="fallbackImg"
      />
    </div>
    <div class="p-4">
      <ul>
        <li><strong>Issuer </strong>{{ nft.issuer }}</li>
        <li>
          <strong>Currency </strong>
          <a :href="nft.url" target="_blank">{{ nft.currency }}</a>
        </li>
      </ul>
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
