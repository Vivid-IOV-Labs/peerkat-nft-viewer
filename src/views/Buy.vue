<template>
  <div v-if="nft" style="height: 100%; overflow: hidden">
    <sell-nft-card v-if="nft" :nft="nft">
      <template #footer>
        <base-button @click="openSellDialog">Create Buy Offer</base-button>
      </template>
    </sell-nft-card>
    <ul class="nav nav-pills nav-fill my-4">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: showTab === 'buy' }"
          href="#"
          @click="showTab = 'buy'"
          >My Buy Offers
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: showTab === 'sell' }"
          href="#"
          @click="showTab = 'sell'"
          >Sell Offers Shared With Me ({{
            nft.selloffers && nft.selloffers.length
          }})</a
        >
      </li>
    </ul>
    <div class="p-4" style="height: 60%; overflow-y: scroll">
      <div v-if="showTab === 'sell' && nft.selloffers">
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
            <accept-sell-offer-card
              v-if="offer"
              :offer="offer"
            ></accept-sell-offer-card>
          </div>
        </div>
      </div>
      <div v-if="showTab === 'buy' && nft.buyoffers" class="p-4">
        <div v-if="nft.buyoffers.length == 0">
          <p>
            Peerkat is not able to find any buy offers, shared with this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div
            v-for="offer in nft.buyoffers"
            :key="offer.nft_offer_index"
            class="mt-4"
          >
            <buy-offer-card
              v-if="offer"
              :token="nft.currency"
              :owner="nft.issuer"
              :offer="offer"
            ></buy-offer-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <base-dialog v-model="toggleSellDialog" :cancellable="true" title="Buy">
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
</template>

<script lang="ts">
debugger;
import { defineComponent, computed, ref } from "vue";
import AcceptSellOfferCard from "@/components/AcceptSellOfferCard.vue";
import SellNftCard from "@/components/SellNftCard.vue";
import BuyOfferCard from "@/components/BuyOfferCard.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import AsyncButton from "@/components/AsyncButton.vue";
import { useStore } from "vuex";
import { devlog } from "../utils/devlog";

export default defineComponent({
  components: {
    AcceptSellOfferCard,
    SellNftCard,
    BaseDialog,
    BaseInput,
    BaseButton,
    AsyncButton,
    BuyOfferCard,
  },
  async setup() {
    const store = useStore();
    // const route = useRoute();
    // const tokenID = route.params.id.toString();
    const nft = computed(() => store.getters["nft/getCurrent"]);
    const saleamount = ref(0);
    const toggleSellDialog = ref(false);

    const showTab = ref("buy");
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
          await store.dispatch("nft/createBuyOffer", {
            walletAddress: walletAddress.value,
            TokenID: nft.value.currency,
            Owner: nft.value.issuer,
            Amount: saleamount.value,
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
