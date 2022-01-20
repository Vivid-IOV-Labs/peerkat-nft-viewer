<template>
  <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link"
    >Back
  </router-link>

  <div class="pb-4">
    <base-card v-if="nft" class="mb-4">
      <template #picture>
        <figure class="w-100">
          <a class="h-100 d-block" href="#" @click.prevent="view">
            <video
              v-if="nft.media_type?.includes('video')"
              :src="`${nft.url}#t=1`"
              muted
              class="img-fluid card-img-top"
              style="
                object-fit: cover;
                height: 100%;
                object-position: center top;
              "
            ></video>
            <img
              v-else-if="nft.media_type?.includes('image')"
              v-lazy="nft.url"
              style="
                object-fit: cover;
                height: 100%;
                object-position: center top;
              "
              class="img-fluid card-img-top"
              alt="Card
          image cap"
            />
            <img
              v-else
              :src="'/thumbnail.jpg'"
              style="
                object-fit: cover;
                height: 100%;
                object-position: center top;
              "
              class="img-fluid card-img-top"
              alt="Card
          image cap"
            />
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
    <h5 v-else>
      Looks like this link to an NFT, that has been shared with you is on the
      {{ nodetype }}. Please switch your Xumm App network to {{ nodetype }}, to
      view this NFT
    </h5>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
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
    const client = computed(() => store.getters["nft/getXrpClient"]);
    const nft = ref<NFT | null>(null);
    try {
      nft.value = await client.value.fetchOne(
        route.params.nftAddress.toString()
      );
      console.log("nft/addShared", nodetype);
      store.commit("nft/addShared", {
        shared: nft.value,
        nodetype,
      });
    } catch (error) {
      console.error(error);
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
