<template>
  <div class="h-100 overflow-hidden d-flex flex-column">
    <div
      v-if="sharedNFTs.length"
      id="scroller"
      ref="scroller"
      class="d-flex flex-row flex-nowrap overflow-auto pb-2"
      style="flex: 1; align-items: center"
    >
      <div v-for="nft in sharedNFTs" :key="nft.issuer" class="col-11">
        <nft-shared-card :nft="nft"></nft-shared-card>
      </div>
    </div>
    <div
      v-else
      class="d-flex flex-column overflow-auto pb-2"
      style="flex: 1; align-items: center; margin-top: 13%"
    >
      <h5 class="text-center mt-2">
        Peerkat is not able to find any NFTs shared with this wallet
      </h5>
      <ul class="mt-2">
        <li class="pb-2">
          To view another user’s XRPL-issued NFT please ensure that you have
          followed the correct link shared by the NFT owner
        </li>
        <li class="pb-2">
          You can view the NFT in fullscreen mode and inspect the transaction
          history of an NFT via the Bithomp explorer
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
declare global {
  interface Window {
    scrollPositionShared: any;
  }
}
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useStore } from "vuex";
import NftSharedCard from "@/components/NftSharedCard.vue";
import { getNodeTypeFromNetwork } from "../utils/getNetworkTypeFromCode";

export default defineComponent({
  components: {
    NftSharedCard,
  },
  beforeRouteLeave() {
    const scroller = <HTMLElement>document.getElementById("scroller");
    if (scroller) {
      const scrollPosition = scroller.scrollLeft;
      window.scrollPositionShared = scrollPosition || 0;
    }
  },
  async setup() {
    const scroller = ref<HTMLElement | null>(null);

    const store = useStore();
    const isInXumm = inject("isInXumm");
    const network = computed(() => store.getters["user/getNetwork"]);
    const nodetype = computed(() => getNodeTypeFromNetwork(network.value));

    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const sharedNFTs = computed(() => {
      return store.getters["nft/getShared"](
        nodetype.value,
        walletAddress.value
      );
    });
    onMounted(() => {
      if (scroller.value) {
        if (window.scrollPositionShared) {
          scroller.value.scrollLeft += window.scrollPositionShared;
        }
      }
    });
    return {
      sharedNFTs,
      isInXumm,
      scroller,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
