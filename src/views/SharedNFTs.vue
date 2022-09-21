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
  <div v-else style="margin-top: 13%">
    <h5 class="text-center mt-2">
      Peerkat is not able to find any NFTs shared with this wallet
    </h5>
    <ul class="mt-2 p-2">
      <li class="pb-2">
        <strong
          >Please note that we currently support XLS14 and XLS14/SOLO NFTs on
          XRPL mainnet, testnet and devnet</strong
        >
      </li>
      <li class="pb-2">
        We also support XLS20 NFTs (with XLS24 metadata only) on XRPL
        nft-devnet.
      </li>
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
</template>
<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { useStore } from "vuex";
import NftSharedCard from "@/components/NftSharedCard.vue";
import { getNodeTypeFromNetwork } from "../utils/getNetworkTypeFromCode";

export default defineComponent({
  components: {
    NftSharedCard,
  },
  async setup() {
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
