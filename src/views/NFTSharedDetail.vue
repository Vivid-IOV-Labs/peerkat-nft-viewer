<template>
  <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link"
    >Back
  </router-link>

  <div class="pb-4">
    <base-card v-if="nft" class="mb-4">
      <template #picture>
        <figure v-if="nft.media_type?.includes('image')" class="w-100">
          <a href="#" @click.prevent="view">
            <img
              class="img-fluid card-img-top"
              :src="nft.url"
              alt="Card image cap"
              @error="fallbackImg"
            />
            <video
              v-if="nft.media_type?.includes('video')"
              :src="`${nft.url}#t=0.5`"
              autoplay
              muted
              loop
              playsinline
              class="w-100 img-fluid card-img-top"
            ></video>
          </a>
        </figure>
      </template>
      <template #text>
        <div class="d-flex flex-column">
          <div class="p4 my-4 d-flex flex-column">
            <strong class="h6 font-weight-bold">Token Name </strong>
            <span>{{ nft.tokenName }}</span>
          </div>
          <div class="p4 d-flex flex-column">
            <strong class="h6 font-weight-bold">Issuer </strong>
            <span>{{ nft.issuer }}</span>
          </div>
        </div>
      </template>
      <template #footer>
        <external-link
          class="mr-2"
          :url="`https://test.bithomp.com/explorer/${$route.params.nftAddress}`"
          >Inspect</external-link
        >
      </template>
    </base-card>
    <h3 v-else>
      Looks like this link to an NFT, that has been shared with you is on the
      {{ nodetype }}. Please switch your Xumm App network to
      {{ othernodetype }}, to view this NFT
    </h3>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { init } from "../services/XrpService";
import BaseCard from "../components/BaseCard.vue";
import {
  getNetworkCodeFromType,
  getNetworkTypeFromCode,
} from "../utils/getNetworkTypeFromCode";
import { NFT } from "../models/NFT";

export default defineComponent({
  components: { BaseCard, ExternalLink },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const nodetype = getNetworkTypeFromCode(
      parseInt(route.params.nodetype as string)
    );
    const othernodetype = nodetype == "TESTNET" ? "MAINNET" : "TESTNET";
    const client = await init(nodetype);
    const nft = ref<NFT | null>(null);
    try {
      nft.value = await client.fetchOne(route.params.nftAddress.toString());
      console.log("NFTSHAREDDETAIL", nft.value);

      // store.commit("nft/addShared", {
      //   shared: nft.value,
      //   nodetype,
      // });
    } catch (error) {
      console.log("NFTSHAREDDETAIL", error);
    }

    return {
      nft,
      othernodetype,
      nodetype,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        nft.value &&
          router.push({
            path: `/shared/${nft.value.issuer}/${getNetworkCodeFromType(
              nodetype
            )}/view`,
          });
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
