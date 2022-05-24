<template>
  <div
    v-if="SellOffers.length"
    id="scroller"
    ref="scroller"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
    style="padding-bottom: 2rem"
  >
    <!-- <pre class="col-11 card">{{ SellOffers }}</pre> -->
    <div v-for="sell in sellOffersNotNull" :key="sell.nft_id" class="col-11">
      <sell-nft-card v-if="sell.schema" :nft="sell.schema">
        <div v-for="(offer, index) in sell.offers" :key="index" class="mt-4">
          <sell-card
            v-if="offer"
            :key="offer.nft_offer_index"
            :offer="offer"
          ></sell-card>
        </div>
      </sell-nft-card>
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
  <div v-if="!SellOffers.length" style="margin-top: 13%">
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
import SellCard from "@/components/SellCard.vue";
import SellNftCard from "@/components/SellNftCard.vue";
import { useStore } from "vuex";
import useIntersectionObserver from "../composable/useIntersectionObserver";
import { devlog } from "../utils/devlog";
import { delay } from "../utils/delay";

export default defineComponent({
  components: {
    SellCard,
    SellNftCard,
  },
  async setup() {
    const store = useStore();
    const sentinel = ref<HTMLElement | null>(null);
    const scroller = ref<HTMLElement | null>(null);
    const endload = ref(false);
    const SellOffers = computed(() => store.getters["nft/getSellOffers"]);
    const sellOffersNotNull = computed(() =>
      SellOffers.value.filter((a: any) => a)
    );
    const xls20count = computed(() => store.getters["nft/getXls20"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const populateSellOffers = async () => {
      try {
        await store.dispatch("nft/fetchXls20", {
          walletAddress: walletAddress.value,
        });
        await store.dispatch("nft/fetchNextSellOffers");
      } catch (error) {
        devlog("ON POPULATE", error);
      }
    };

    const { unobserve, observe, isIntersecting } = useIntersectionObserver(
      scroller,
      sentinel
    );
    async function fetchNextSellOffers() {
      unobserve();
      await delay(3000);
      await store.dispatch("nft/fetchNextSellOffers");
      observe();
    }

    watch(
      isIntersecting,
      async (val) => {
        if (val) {
          if (xls20count.value.length > SellOffers.value.length) {
            await fetchNextSellOffers();
          }
        }
      },
      { deep: false }
    );
    watch(SellOffers, async (newNfts) => {
      if (xls20count.value.length == newNfts.length) {
        unobserve();
        endload.value = true;
      }
    });

    await populateSellOffers();

    return {
      sentinel,
      endload,
      scroller,
      SellOffers,
      sellOffersNotNull,
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
