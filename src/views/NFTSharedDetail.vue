<template>
  <router-link :to="{ path: `/shared` }" class="my-4 btn btn-link"
    >Back
  </router-link>

  <div class="pb-4">
    <base-card class="mb-4">
      <template #picture>
        <figure v-if="nft.media_type?.includes('image')" class="w-100">
          <img
            class="img-fluid card-img-top"
            :src="nft.url"
            alt="Card image cap"
            @error="fallbackImg"
          />
        </figure>
        <video
          v-if="nft.media_type?.includes('video')"
          :src="nft.url"
          autoplay
          muted
          loop
          playsinline
          class="w-100 img-fluid card-img-top"
        ></video>
      </template>
      <template #title>
        <h3>{{ nft.tokenName }}</h3>
      </template>
      <template #text>
        <div class="d-flex flex-column">
          <div class="p4 my-4 d-flex flex-column">
            <strong class="h6 font-weight-bold">Currency </strong>
            <span>{{ nft.currency }}</span>
          </div>
          <div class="p4 d-flex flex-column">
            <strong class="h6 font-weight-bold">Issuer </strong>
            <span>{{ nft.issuer }}</span>
          </div>
        </div>
      </template>
      <template #footer>
        <external-link
          :url="`https://test.bithomp.com/explorer/${$route.params.nftAddress}`"
          >Inspect</external-link
        >
      </template>
    </base-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import XrpService from "../services/XrpService";
import BaseCard from "../components/BaseCard.vue";

export default defineComponent({
  components: { BaseCard, ExternalLink },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const showActions = ref(false);
    const client = await XrpService;

    const nft = await client.fetchOne(
      route.params.nftAddress.toString(),
      route.params.currency.toString()
    );
    store.commit("nft/addShared", nft);
    return {
      nft,
      showActions,
      toggleAction() {
        showActions.value = !showActions.value;
      },
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
<style>
.smooth-enter-active,
.smooth-leave-active {
  transition: 0.5s;
}
.smooth-enter,
.smooth-leave-to {
  height: 0;
  opacity: 0;
}
</style>
