<template>
  <div
    v-if="NFTMedia.length"
    id="scroller"
    ref="scroller"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
    style="padding-bottom: 2rem"
  >
    <div v-for="nft in NFTMedia" :key="nft.issuer" class="col-11">
      <nft-card :nft="nft"></nft-card>
    </div>
    <div
      v-if="!endload"
      ref="sentinel"
      style="height: 100%"
      class="col-11 card"
    >
      <div class="d-flex align-items-center justify-content-center card-body">
        <div
          class="spinner-border"
          style="width: 4rem; height: 4rem; color: #666"
          role="status"
        ></div>
      </div>
      <h5>Loading Next NFTs...</h5>
    </div>
  </div>
  <div v-if="!NFTMedia.length" style="margin-top: 13%">
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
        <strong
          >Please note that we currently support XLS14 and XLS14/SOLO NFTs on
          XRPL only</strong
        >. We will support XLS20 native NFTs on XRPL
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import NftCard from "@/components/NftCard.vue";
import { useStore } from "vuex";
import { inject } from "vue";
import useIntersectionObserver from "../composable/useIntersectionObserver";
import { devlog } from "../utils/devlog";
import store from "../store";

export default defineComponent({
  components: {
    NftCard,
  },
  async beforeRouteEnter(from, to, next) {
    const isConnected = store.getters["nft/getIsConnected"];
    const all = store.getters["nft/getAll"];
    const lines = store.getters["nft/getAll"];

    const allLoaded = all.length == lines.length;
    if (!isConnected && !allLoaded) {
      await store.dispatch("nft/connect");
    }
    next();
  },
  beforeRouteLeave(from, to, next) {
    const isConnected = store.getters["nft/getIsConnected"];
    if (isConnected) {
      store.dispatch("nft/disconnect");
      next();
    }
    next();
  },
  async setup() {
    const store = useStore();
    const sentinel = ref<HTMLElement | null>(null);
    const scroller = ref<HTMLElement | null>(null);
    const isInXumm = inject("isInXumm");

    const isConnected = computed(() => store.getters["nft/getIsConnected"]);
    const endload = ref(false);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const network = computed(() => store.getters["user/getNetwork"]);
    const NFTMedia = computed(() => store.getters["nft/getAll"]);
    const lines = computed(() => store.getters["nft/getLines"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const poupulateXls20NFTs = async () => {
      try {
        await store.dispatch("nft/fetchXls20", {
          walletAddress: walletAddress.value,
        });
      } catch (error) {
        devlog("ON POPULATE", error);
      }
    };

    const populateNFTs = async () => {
      try {
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: walletAddress.value,
          nodetype: nodetype.value,
        });
        await store.dispatch("nft/fetchNext", nodetype.value);
      } catch (error) {
        devlog("ON POPULATE", error);
      }
    };

    const { unobserve, observe, isIntersecting } = useIntersectionObserver(
      scroller,
      sentinel
    );
    async function fetchNext() {
      unobserve();
      await store.dispatch("nft/fetchNext", nodetype.value);
      observe();
    }
    watch(isIntersecting, async () => {
      if (!endload.value) {
        await fetchNext();
      }
    });
    watch(NFTMedia, async (newNfts) => {
      if (lines.value && lines.value.length == newNfts.length) {
        unobserve();
        endload.value = true;
        await store.dispatch("nft/disconnect");
      }
    });
    // if (lines.value && lines.value.length === 0) {
    //   await populateNFTs();
    // }
    await poupulateXls20NFTs();

    return {
      sentinel,
      endload,
      scroller,
      lines,
      isConnected,
      NFTMedia,
      isInXumm,
      async connect() {
        await store.dispatch("nft/connect", nodetype.value);
      },
      async disconnect() {
        await store.dispatch("nft/disconnect", nodetype.value);
      },
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
