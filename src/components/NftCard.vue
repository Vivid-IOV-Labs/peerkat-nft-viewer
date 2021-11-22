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
        <strong class="h6 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
      </p>
      <div class="card-text flex">
        <strong class="h7 font-weight-bold">Issuer </strong><br />
        <a
          class="btn-link d-block"
          :class="{
            'text-truncate truncate': !showIssuer,
            untruncate: showIssuer,
          }"
          href="#"
          aria-expanded="true"
          @click.prevent="showIssuer = !showIssuer"
          >{{ nft.issuer }}</a
        >
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <router-link
        :to="{ path: `/nft/${nft.issuer}/update` }"
        class="mt-4 mr-2 btn btn-link"
        >Update
      </router-link>
      <router-link
        :to="{ path: `/nft/${nft.issuer}/view` }"
        class="mt-4 btn btn-link"
        >link
      </router-link>
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
<style>
.truncate {
  min-width: 180px;
  max-width: 200px;
  width: 100%;
}
.untruncate {
  min-width: auto;
  max-width: auto;
}
</style>
