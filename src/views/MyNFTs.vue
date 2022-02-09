<template>
  <div
    v-if="NFTMedia.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
    style="padding-bottom: 2rem"
  >
    <div v-for="nft in NFTMedia" :key="nft.issuer" class="col-11">
      <nft-card :nft="nft"></nft-card>
    </div>
    <div
      v-if="NFTMedia.length < lines.length"
      ref="sentinel"
      class="col-1"
      style="height: 100%; width: 1px"
    ></div>
  </div>
  <div
    v-if="!NFTMedia.length"
    class="p-2"
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
      flex-direction: column;
    "
  >
    <h5 class="text-center mt-2">
      Peerkat is not able to find any NFTs in this wallet
    </h5>
    <ul class="mt-2 p-2">
      <li class="pb-2">
        To receive an XRPL-issued NFT please ensure that you have correctly
        signed the corresponding trustline transaction
      </li>
      <li class="pb-2">
        You can view an NFT in fullscreen mode, inspect the transaction history
        of an NFT via the Bithomp explorer and share your NFTs with another user
        to enable them to view the NFTs too
      </li>
      <li class="pb-2">
        Please follow us on Twitter
        <external-link :url="`https://twitter.com/PeerkatOfficial`"
          >@Peerkatofficial</external-link
        >
        and at
        <external-link :url="`https://peerkat.io`">peerkat.io</external-link>
        for updates, airdrop news and product releases (XLS20d NFT minting
        platform coming soon)
      </li>
    </ul>
  </div>
  <div
    v-if="isLoadingNext"
    style="
      height: 100%;
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      opacity: 0.8;
      background: rgba(0, 0, 0, 0.6);
      transition: all 1s ease;
    "
    class="d-flex align-items-center justify-content-center"
  >
    <div
      class="spinner-border"
      style="width: 4rem; height: 4rem; color: #666"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import NftCard from "@/components/NftCard.vue";
import { useStore } from "vuex";
import { inject } from "vue";
import useIntersectionObserver from "../composable/useIntersectionObserver";
import { devlog } from "../utils/devlog";

export default defineComponent({
  components: {
    NftCard,
    ExternalLink,
  },
  async setup() {
    const store = useStore();
    const sentinel = ref<HTMLElement | null>(null);
    const root = ref<HTMLElement | null>(null);
    const isInXumm = inject("isInXumm");

    const endscroll = ref(false);
    const isLoadingNext = ref(false);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const NFTMedia = computed(() => store.getters["nft/getAll"]);
    const lines = computed(() => store.getters["nft/getLines"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const populateNFTs = async () => {
      try {
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: walletAddress.value,
          nodetype: nodetype.value,
        });
        await store.dispatch("nft/fetchNext", nodetype.value);
      } catch (error) {
        devlog(error);
      }
    };

    const { unobserve, isIntersecting } = useIntersectionObserver(sentinel);
    watch(isIntersecting, async () => {
      isLoadingNext.value = true;
      await store.dispatch("nft/fetchNext", nodetype.value);
      setTimeout(() => {
        isLoadingNext.value = false;
      }, 500);
    });
    watch(NFTMedia, (newNfts) => {
      if (lines.value.length == newNfts.length) {
        unobserve();
        endscroll.value = true;
      }
    });
    if (lines.value.length === 0) {
      await populateNFTs();
    }

    return {
      sentinel,
      endscroll,
      root,
      lines,
      NFTMedia,
      isInXumm,
      isLoadingNext,
    };
  },
});
</script>
<style scoped>
.horizontal-scroll-container {
  width: 100%;
  height: 100%;

  position: relative;
}
.horizontal-scroll-container__left-scrim:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  background: linear-gradient(to right, #111, transparent);
}
.horizontal-scroll-container__right-scrim:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  height: 100%;
  background: linear-gradient(to left, #111, transparent);
}
.horizontal-scroll-container .horizontal-scroller {
  display: grid;
  grid-gap: 1rem;
  height: 100%;
  padding-right: 0;
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
