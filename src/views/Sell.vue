<template>
  <BackLink path="/wallet" />
  <div v-if="nft">
    <h1 v-if="nft.tokenName" class="h2 font-weight-bold mb-4 text-center">
      Offers for {{ nft.tokenName }}
    </h1>
    <h1 v-else class="h2 font-weight-bold mb-4 text-center">Offers for NFT</h1>
    <base-dialog v-model="toggleSellDialog" :cancellable="true" title="Sell">
      <template #body>
        <strong v-if="nft.tokenName" class="h6 font-weight-bold"
          >Token Name </strong
        ><br />
        {{ nft.tokenName }}<br />
        <strong class="h7 font-weight-bold">Token ID </strong><br />
        <span style="word-break: break-all">{{ nft.currency }}</span
        ><br />
        <div v-if="nft.desc" class="mt-2">
          <strong class="h7 font-weight-bold">Description </strong><br />
          <div v-html="nft.desc"></div>
        </div>
        <div class="form-group flex justify-between">
          <base-input
            id="saleamount"
            v-model="saleamount"
            :label-hidden="true"
            label-text="saleamount"
            type="number"
          ></base-input>
          <strong>XRP</strong>
        </div>
      </template>
      <template #footer>
        <div>
          <async-button class="mr-2" :on-click="confirmSell"
            >Confirm</async-button
          >
        </div>
      </template>
    </base-dialog>
    <sell-nft-card v-if="nft" :nft="nft">
      <!-- <template #footer>
        <base-button @click="openSellDialog">Create Sell Offer</base-button>
      </template> -->
    </sell-nft-card>
    <ul class="nav nav-pills nav-fill my-4">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ 'active  bg-danger': showTab === 'sell' }"
          href="#"
          @click="showTab = 'sell'"
          >Sell Offers
          <span v-if="nft.selloffers && nft.selloffers.length"
            >({{ nft.selloffers.length }})</span
          >
          <span v-else>(0)</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ 'active text-white bg-success': showTab === 'buy' }"
          href="#"
          @click="showTab = 'buy'"
          >Buy Offers
          <span v-if="nft.buyoffers && nft.buyoffers.length"
            >({{ nft.buyoffers.length }})</span
          >
          <span v-else>(0)</span>
        </a>
      </li>
    </ul>
    <div>
      <div v-if="showTab === 'sell'">
        <div v-if="nft.selloffers.length == 0">
          <p>No current offers found</p>
        </div>
        <div v-else>
          <div
            v-for="offer in nft.selloffers.sort(
              (a:any, b:any) => b.amount + b.amount
            )"
            :key="offer.nft_offer_index"
            class="mt-4"
          >
            <sell-card
              v-if="offer"
              :token="nft.currency"
              :offer="offer"
            ></sell-card>
          </div>
        </div>
      </div>
      <div v-if="showTab === 'buy'">
        <div v-if="!nft.buyoffers || nft.buyoffers.length == 0">
          <p>No current offers found</p>
        </div>
        <div v-else>
          <div
            v-for="offer in nft.buyoffers.sort(
              (a:any, b:any) => b.amount - b.amount
            )"
            :key="offer.nft_offer_index"
            class="mt-4"
          >
            <accept-buy-offer-card
              v-if="offer"
              :offer="offer"
              :nft-id="nft.currency"
            ></accept-buy-offer-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h5 class="text-center mt-2">An XLS-20 NFT has not been selected</h5>
    <ul class="mt-2 p-2">
      <li class="pb-2">
        To view offers for an XLS-20 NFT, please select the “Offers” button on
        one of your XLS-20 NFTs in the “My Wallet” or “Shared with me” page
        views
      </li>
      <li class="pb-2">
        If you do not have any XLS-20 NFTs in your wallet or that have been
        shared with you, please click here to find out how to get one.
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import SellCard from "@/components/SellCard.vue";
import SellNftCard from "@/components/SellNftCard.vue";
import AcceptBuyOfferCard from "@/components/AcceptBuyOfferCard.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseInput from "@/components/BaseInput.vue";
// import BaseButton from "@/components/BaseButton.vue";
import BackLink from "@/components/BackLink.vue";

import AsyncButton from "@/components/AsyncButton.vue";
import { useStore } from "vuex";
import { devlog } from "../utils/devlog";

import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";
import { fetchSellOffers } from "../services/XrpService";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    SellCard,
    SellNftCard,
    BaseDialog,
    BaseInput,
    BackLink,
    // BaseButton,
    AsyncButton,
    AcceptBuyOfferCard,
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    // const tokenID = route.params.id.toString();
    const nft = computed(() => store.getters["nft/getCurrent"]);
    const saleamount = ref(0);
    const toggleSellDialog = ref(false);

    // const currenTab =
    //   nft.value.selloffers.length == 0 && nft.value.buyoffers.length == 0
    //     ? "sell"
    //     : nft.value.selloffers.length == 0 && nft.value.buyoffers.length > 0
    //     ? "buy"
    //     : "sell";
    const currenTab = "buy";
    const showTab = ref(currenTab);
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);

    return {
      nft,
      saleamount,
      toggleSellDialog,
      showTab,
      openSellDialog() {
        // toggleSellDialog.value = true;
        router.push({
          path: `create_sell_offer`,
        });
      },
      async confirmSell() {
        devlog("isInXumm", isInXumm);

        if (isInXumm()) {
          const { created } = await XummSdk.createSellOffer(
            {
              Account: walletAddress.value,
              NFTokenID: nft.value.currency,
              Amount: (saleamount.value * 1000000).toString(),
              User: user.value,
            },
            async () => {
              const { offers } = await fetchSellOffers(nft.value.currency);

              await store.commit(
                "nft/addSellOffer",
                offers.filter((o) => o.owner == walletAddress.value)
              );
            }
          );
          const { uuid } = created;
          XummSdk.openSignRequest(uuid);
        } else {
          try {
            await store.dispatch("nft/createSellOffer", {
              walletAddress: walletAddress.value,
              TokenID: nft.value.currency,
              amount: saleamount.value,
            });
          } catch (error) {
            devlog("CretaPayload", error);
          }
        }
        toggleSellDialog.value = false;
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
