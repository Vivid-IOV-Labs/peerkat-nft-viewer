<template>
  <div
    v-if="sharedNFTs.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
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
    "
  >
    <h3 class="text-center mt-4">
      Peerkat is not able to find any NFTs shared with this wallet
    </h3>
    <ul class="text-center mt-4">
      <li>
        To view another user’s XRPL-issued NFT please ensure that you have
        followed the correct deep link shared by the user
      </li>
      <li>
        You can view the NFT in fullscreen mode and inspect the transaction
        history of an NFT via the Bithomp explorer
      </li>
      <li>
        Please follow us on Twitter @Peerkatofficial and at
        <external-link class="mr-2" :url="`https://peerkat.io`"
          >peerkat.io</external-link
        >
        for updates and new product releases (XLS-20 minting platform coming
        soon)
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
    let nodetype;
    let sharedNFTs;
    if (isInXumm) {
      const ottData = computed(() => store.getters["xumm/getOttData"]);

      nodetype = computed(() =>
        ottData.value.nodetype == "TESTNET" ? "test" : "main"
      );
      sharedNFTs = computed(() => {
        return store.getters["nft/getShared"](
          ottData.value.nodetype.toLowerCase()
        );
      });
    } else {
      sharedNFTs = computed(() => {
        return store.getters["nft/getShared"]("testnet");
      });
    }

    return {
      sharedNFTs,
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
