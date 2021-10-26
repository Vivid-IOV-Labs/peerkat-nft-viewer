<template>
  <div class="card m-4">
    <figure>
      <img
        class="card-img-top"
        :src="posterUrl"
        alt="Card image cap"
        @error="fallbackImg"
      />
    </figure>
    <div class="card-body">
      <p class="card-title"><strong>Token Name </strong> {{ nft.currency }}</p>
      <p class="card-text"><strong>Issuer </strong>{{ nft.issuer }}</p>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <base-button class="mt-4" href="#" target="_blank">link </base-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseButton from "@/components/BaseButton.vue";

export default defineComponent({
  components: { BaseButton },
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
