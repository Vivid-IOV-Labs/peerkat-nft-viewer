<template>
  <div
    v-if="sharedNFTs.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
    style="padding-bottom: 2rem"
  >
    <div v-for="nft in sharedNFTs" :key="nft.issuer" class="col-11">
      <nft-shared-card :nft="nft"></nft-shared-card>
    </div>
  </div>
  <div
    v-else
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
      flex-direction: column;
    "
  >
    <h5 class="text-center mt-2">
      Peerkat is not able to find any NFTs shared with this wallet
    </h5>
    <ul class="mt-2 p-4">
      <li class="pb-2">
        To view another user’s XRPL-issued NFT please ensure that you have
        followed the correct deep link shared by the user
      </li>
      <li class="pb-2">
        You can view the NFT in fullscreen mode and inspect the transaction
        history of an NFT via the Bithomp explorer
      </li>
      <li class="pb-2">
        Please follow us on Twitter
        <external-link class="mr-2" :url="`https://twitter.com/PeerkatOfficial`"
          >@Peerkatofficial</external-link
        >
        and at
        <external-link :url="`https://peerkat.io`">peerkat.io</external-link>
        for updates and new product releases (XLS20d)
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { useStore } from "vuex";
import NftSharedCard from "@/components/NftSharedCard.vue";
import ExternalLink from "@/components/ExternalLink.vue";

export default defineComponent({
  components: {
    NftSharedCard,
    ExternalLink,
  },
  async setup() {
    const store = useStore();
    const isInXumm = inject("isInXumm");
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const sharedNFTs = computed(() => {
      return store.getters["nft/getShared"](nodetype.value);
    });

    return {
      sharedNFTs,
      isInXumm,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
