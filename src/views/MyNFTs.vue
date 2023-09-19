<template>
  <div class="h-100 overflow-hidden d-flex flex-column">
    <div
      v-if="NFTMedia.length"
      id="scroller"
      ref="scroller"
      class="d-flex flex-row flex-nowrap overflow-auto pb-2"
      style="flex: 1; align-items: center"
      :class="{ loading }"
    >
      <div v-for="nft in NFTMedia" :key="nft.currency" class="col-11">
        <nft-card
          style="height: 70vh"
          v-if="nft"
          :id="`tokenID-${nft.currency}`"
          :nft="nft"
        ></nft-card>
      </div>
      <div
        v-if="!endload"
        id="sentinel"
        ref="sentinel"
        style="height: 70vh"
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
    <div
      v-if="!NFTMedia.length"
      class="d-flex flex-column overflow-auto pb-2"
      style="flex: 1; align-items: center; margin-top: 13%"
    >
      <h5 class="text-center mt-2">
        Peerkat is not able to find any NFTs in this wallet
      </h5>
      <ul class="mt-2">
        <li class="pb-2">
          You can view an NFT in fullscreen mode, view current offers for your
          NFTs, inspect the transaction history of an NFT via the Bithomp
          explorer and share your NFTs with another user to enable them to view
          the NFTs too
        </li>
      </ul>
    </div>

    <!-- <div
      style="heigth: 15%; background: #16dbdb"
      v-if="NFTMedia.length"
      class="d-flex w-100 pt-4 px-2 mt-4 align-items-end justify-content-between flex-wrap flex-center"
    >
      <div style="width: 160px"><img class="img-fluid" src="/whale.png" /></div>

      <div class="text-white py-4">
        <h4 class="font-weight-bold">How does your wallet compare?</h4>
        <span
          >Use our XRP Ledger analysis to check the strength of your
          wallet!</span
        >
      </div>
      <external-link url="https://www.peerkat.com/whales " class="pb-4">
        <span style="background: white" class="btn btn-white btn-sm btn">
          View XRP Rich List</span
        >
      </external-link>
    </div> -->
    <external-link
      style="heigth: 15%"
      url="https://www.peerkat.com/whales"
      class="d-block w-100 rounded mt-2"
    >
      <img class="img-fluid w-100 h-100 rounded-2" src="/banner-whales.png" />
    </external-link>
  </div>
</template>

<script lang="ts">
declare global {
  interface Window {
    scrollPositionWallet: any;
  }
}
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import NftCard from "@/components/NftCard.vue";
import { useStore } from "vuex";
import { inject } from "vue";
import useIntersectionObserver from "../composable/useIntersectionObserver";
import { devlog } from "../utils/devlog";
import { delay } from "../utils/delay";
import { useRoute } from "vue-router";
import ExternalLink from "@/components/ExternalLink.vue";

export default defineComponent({
  components: {
    NftCard,
    ExternalLink,
  },
  beforeRouteLeave() {
    const scroller = <HTMLElement>document.getElementById("scroller");
    if (scroller) {
      const scrollPosition = scroller.scrollLeft;
      window.scrollPositionWallet = scrollPosition || 0;
    }
  },
  async setup() {
    const store = useStore();
    const route = useRoute();
    const sentinel = ref<HTMLElement | null>(null);
    const scroller = ref<HTMLElement | null>(null);
    const isInXumm = inject("isInXumm");

    const isConnected = computed(() => store.getters["nft/getIsConnected"]);
    const endload = ref(true);
    const loading = computed(() => store.getters["ui/getIsloading"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const NFTMedia = computed(() =>
      store.getters["nft/getAll"].filter((a: any) => a)
    );
    const lines = computed(() => store.getters["nft/getLines"]);
    const xls20count = computed(() => store.getters["nft/getXls20"]);
    const all = computed(() => store.getters["nft/getAll"]);
    const allXls20 = computed(() => store.getters["nft/getAllXls20"]);
    const allXls14 = computed(() => store.getters["nft/getAllXls14"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const lastVisited = computed(() => store.getters["nft/getCurrent"]);

    const { unobserve, observe, isIntersecting } = useIntersectionObserver(
      scroller,
      sentinel
    );
    unobserve();

    onMounted(() => {
      if (scroller.value) {
        if (window.scrollPositionWallet) {
          scroller.value.scrollLeft += window.scrollPositionWallet;
        }
      }
    });

    if (
      lines.value.length + xls20count.value.length > NFTMedia.value.length ||
      NFTMedia.value.length == 0
    ) {
      endload.value = false;
    }

    const poupulateXls20NFTs = async () => {
      store.commit("ui/setIsloading", true);
      await store.dispatch("nft/fetchXls20", {
        walletAddress: walletAddress.value,
      });
      await store.dispatch("nft/fetchNextXls20");
      store.commit("ui/setIsloading", false);
    };

    const populateXls14NFTs = async () => {
      if (!loading.value && lines.value.length > allXls14.value.length) {
        try {
          store.commit("ui/setIsloading", true);
          await store.dispatch("nft/fetchNftLines", {
            walletAddress: walletAddress.value,
            nodetype: nodetype.value,
          });

          await store.dispatch("nft/fetchNext", nodetype.value);
          store.commit("ui/setIsloading", false);
        } catch (error) {
          store.commit("ui/setIsloading", false);
          devlog("ON POPULATE", error);
        }
      }
    };

    const populateNFTs = async () => {
      try {
        await poupulateXls20NFTs();
        if (allXls20.value.length == 0) {
          await populateXls14NFTs();
        }
      } catch (error) {
        devlog(error);
        store.commit("ui/setIsloading", false);

        await populateXls14NFTs();
      }
    };

    async function fetchNext() {
      unobserve();
      store.commit("ui/setIsloading", true);

      await delay(1000);
      try {
        await store.dispatch("nft/fetchNext", nodetype.value);
      } finally {
        store.commit("ui/setIsloading", false);

        observe();
      }
    }
    async function fetchNextXls20() {
      unobserve();
      store.commit("ui/setIsloading", true);

      await delay(1000);
      await store.dispatch("nft/fetchNextXls20");
      store.commit("ui/setIsloading", false);

      observe();
    }
    watch(
      isIntersecting,
      async (val) => {
        if (val && !loading.value) {
          if (xls20count.value.length > allXls20.value.length) {
            await fetchNextXls20();
          } else {
            if (lines.value.length > allXls14.value.length) {
              await fetchNext();
            }
          }
        }
      },
      { deep: false }
    );
    watch(
      NFTMedia,
      async (newNfts) => {
        if (lines.value.length + xls20count.value.length == newNfts.length) {
          unobserve();
          endload.value = true;
          //    await store.dispatch("nft/disconnect");
        }
      },
      { deep: false }
    );

    if (
      lines.value &&
      lines.value.length === 0 &&
      !(lines.value.length + xls20count.value.length > NFTMedia.value.length)
    ) {
      try {
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: walletAddress.value,
          nodetype: nodetype.value,
        });
      } catch (error) {
        store.commit("ui/setIsloading", false);

        devlog("ON POPULATE", error);
      }
    }
    if (all.value.length === 0) {
      if (
        xls20count.value &&
        xls20count.value.length === 0 &&
        allXls14.value.length === 0
      ) {
        await populateNFTs();
      } else {
        await populateXls14NFTs();
      }
    }

    return {
      sentinel,
      endload,
      scroller,
      lines,
      isConnected,
      NFTMedia,
      loading,
      isInXumm,
      xls20count,
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
