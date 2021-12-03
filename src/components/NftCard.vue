<template>
  <base-card>
    <template #picture>
      <figure>
        <img
          class="card-img-top"
          :src="posterUrl"
          alt="Card image cap"
          @error="fallbackImg"
        />
      </figure>
    </template>

    <template #title>
      <strong class="h6 font-weight-bold">Token Name </strong><br />
      {{ nft.tokenName }}
    </template>
    <template #text>
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
    </template>
    <template #footer>
      <div class="d-flex justify-content-end">
        <router-link
          :to="{ path: `/nft/${nft.issuer}/${nft.currency}/view` }"
          class="mt-4 btn btn-link"
          >View
        </router-link>
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
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
