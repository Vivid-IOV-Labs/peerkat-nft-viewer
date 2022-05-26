<template>
  <div v-if="nft" class="p-4">
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
          >My Sell Offers ({{ nft.offers.length }})</a
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
    <div class="p-4 scroller">
      <div v-if="showTab === 'sell'">
        <div v-if="nft.offers.length == 0">
          <p>
            Peerkat is not able to find any sell offers, created by this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div v-for="(offer, index) in nft.offers" :key="index" class="mt-4">
            <sell-card
              v-if="offer"
              :key="offer.nft_offer_index"
              :token="nft.currency"
              :offer="offer"
            ></sell-card>
          </div>
        </div>
      </div>
      <div v-if="showTab === 'buy'" class="p-4">
        <p>
          Peerkat is not able to find any buy offers, shared with this wallet
          for this NFT
        </p>
      </div>
    </div>
  </div>
  <base-dialog v-model="toggleSellDialog" title="Sell">
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
        <base-button class="mr-2" @click="confirmSell">Confirm</base-button>
      </div>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import SellCard from "@/components/SellCard.vue";
import SellNftCard from "@/components/SellNftCard.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useStore } from "vuex";
import { createSellOffer } from "../services/XrpService";
import { devlog } from "../utils/devlog";

export default defineComponent({
  components: {
    SellCard,
    SellNftCard,
    BaseDialog,
    BaseInput,
    BaseButton,
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
    return {
      nft,
      saleamount,
      toggleSellDialog,
      showTab,
      openSellDialog() {
        toggleSellDialog.value = true;
      },
      async confirmSell() {
        try {
          await store.dispatch("nft/createSellOffer", {
            walletAddress: walletAddress.value,
            TokenID: nft.value.currency,
            amount: saleamount.value,
          });
          toggleSellDialog.value = false;
          // const sellOffer = await createSellOffer({
          //   walletAddress: walletAddress.value,
          //   TokenID: nft.value.currency,
          //   amount: saleamount.value,
          // });
          //   const transactionBlob = {
          //     TransactionType: "NFTokenCreateOffer",
          //     Account: walletAddress.value,
          //     TokenID: props.nft.currency,
          //     Amount: saleamount.value,
          //     Flags: 1, //parseInt(flags.value)
          //   };
          //   XummSdk.createPayload({
          //     // user_token: user.value,
          //     txjson: {
          //       TransactionType: "Payment",
          //       Destination: "rsC8uuD5EzkDJESoFbttHWZxzNv8JYdmCw",
          //       Fee: "12",
          //     },
          //   });
          //   devlog("CretaPayload", {
          //     user_token: user.value,
          //     txjson: transactionBlob,
          //   });
        } catch (error) {
          devlog("CretaPayload", error);
        }

        // openSignRequest(user.value);
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
