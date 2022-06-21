<template>
  <div v-if="nft">
    <base-dialog v-model="toggleSellDialog" :cancellable="true" title="Sell">
      <template #body>
        <strong class="h6 font-weight-bold">Token Name </strong><br />
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
      <template #footer>
        <base-button @click="openSellDialog">Create Sell Offer</base-button>
      </template>
    </sell-nft-card>
    <ul class="nav nav-pills nav-fill my-4">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: showTab === 'sell' }"
          href="#"
          @click="showTab = 'sell'"
          >My Sell Offers ({{ nft.selloffers.length }})</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: showTab === 'buy' }"
          href="#"
          @click="showTab = 'buy'"
          >Buy Offers shared with me
        </a>
      </li>
    </ul>
    <div>
      <div v-if="showTab === 'sell'">
        <div v-if="nft.selloffers.length == 0">
          <p>
            Peerkat is not able to find any sell offers, created by this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div
            v-for="offer in nft.selloffers"
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
        <div v-if="!sharedBUyOffers || sharedBUyOffers.length == 0">
          <p>
            Peerkat is not able to find any buy offers, shared with this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div
            v-for="offer in sharedBUyOffers"
            :key="offer.nft_offer_index"
            class="mt-4"
          >
            <accept-buy-offer-card
              v-if="offer"
              :offer="offer"
            ></accept-buy-offer-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h5 class="text-center mt-2">An XLS20 NFT has not been selected</h5>
    <ul class="mt-2 p-2">
      <li class="pb-2">
        To view offers for an XLS20 NFT, please select the “Offers” button on
        one of your XLS20 NFTs in the “My Wallet” or “Shared with me” pages
      </li>
      <li class="pb-2">
        If you do not have any XLS20 NFT that are in your wallet or have been
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
import BaseButton from "@/components/BaseButton.vue";
import AsyncButton from "@/components/AsyncButton.vue";
import { useStore } from "vuex";
import { devlog } from "../utils/devlog";

import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";
import { openSignRequest } from "../utils/XummActions";
import { fetchSellOffers } from "../services/XrpService";

export default defineComponent({
  components: {
    SellCard,
    SellNftCard,
    BaseDialog,
    BaseInput,
    BaseButton,
    AsyncButton,
    AcceptBuyOfferCard,
  },
  async setup() {
    const store = useStore();
    // const route = useRoute();
    // const tokenID = route.params.id.toString();
    const nft = computed(() => store.getters["nft/getCurrent"]);
    const saleamount = ref(0);
    const toggleSellDialog = ref(false);

    const showTab = ref("sell");
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);
    const sharedBUyOffers = computed(() => {
      return store.getters["nft/getSharedBuyOffers"](nft.value.currency);
    });
    return {
      nft,
      saleamount,
      toggleSellDialog,
      showTab,
      sharedBUyOffers,
      openSellDialog() {
        toggleSellDialog.value = true;
      },
      async confirmSell() {
        devlog("isInXumm", isInXumm);

        if (isInXumm()) {
          devlog("isInXumm", isInXumm);

          const { created } = await XummSdk.createSellOffer(
            {
              Account: walletAddress.value,
              NFTokenID: nft.value.currency,
              Amount: (saleamount.value * 1000000).toString(),
              User: user.value,
            },
            async () => {
              devlog("callback ");

              const { offers } = await fetchSellOffers(nft.value.currency);
              devlog("sell create offers ", offers);

              await store.commit("nft/addSellOffer", offers);
            }
          );
          devlog("sell create confirm ", created);
          const { uuid } = created;
          openSignRequest(uuid);
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
