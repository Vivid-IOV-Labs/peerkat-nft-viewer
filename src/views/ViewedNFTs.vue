<template>
  <div
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
    "
  >
    <h3 class="text-center mt-4">Your recently viewed items NFTs</h3>
    <pre>{{ nft }}</pre>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  async setup() {
    const nft = localStorage.getItem("shared")
      ? JSON.parse(localStorage.getItem("shared") as string)
      : [];
    console.log(localStorage.getItem("test"));
    return {
      nft,
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
