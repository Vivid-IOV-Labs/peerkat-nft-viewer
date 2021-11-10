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
      <p class="card-title">
        <strong class="h6 font-weight-bold">Token Name </strong>
        {{ nft.currency }}
      </p>
      <p class="card-text flex">
        <strong class="h7 font-weight-bold">Issuer </strong>
        <a
          class="btn btn-link d-inline-block text-truncate"
          style="min-width: 180px; max-width: 200px; width: 100%"
          href="#"
          aria-expanded="true"
          @click.prevent="showIssuer = !showIssuer"
          >{{ nft.issuer }}</a
        >
      </p>
      <transition name="fade">
        <span
          v-if="showIssuer"
          :class="{ show: showIssuer }"
          class="collapse block"
        >
          {{ nft.issuer }}
        </span>
      </transition>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <a class="mt-4 btn btn-link" href="https://peerkat.io/" target="_blank"
        >link
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
  },
  setup: () => {
    const showIssuer = ref(false);
    return {
      showIssuer,
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
