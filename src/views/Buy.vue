<template>
  <div v-if="nft">
    <sell-nft-card v-if="nft" :nft="nft" :shared="true">
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
          <span v-if="nft.buyoffers && nft.buyoffers.length"
            >({{ nft.buyoffers && nft.buyoffers.length }})</span
          >
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: showTab === 'sell' }"
          href="#"
          @click="showTab = 'sell'"
          >Current Sell Offers
          <span v-if="nft.selloffers && nft.selloffers.length"
            >({{ nft.selloffers && nft.selloffers.length }})</span
          ></a
        >
      </li>
    </ul>
    <div>
      <div v-if="showTab === 'sell' && nft.selloffers">
        <div v-if="nft.selloffers.length == 0">
          <p>
            Peerkat is not able to find any sell offers, created by this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div
            v-for="offer in nft.selloffers.sort(
              (a:any, b:any) => b.amount - b.amount
            )"
            :key="offer.nft_offer_index"
            class="mt-4"
          >
            <accept-sell-offer-card
              v-if="offer"
              :offer="offer"
              :nft-id="nft.currency"
            ></accept-sell-offer-card>
          </div>
        </div>
      </div>
      <div v-if="showTab === 'buy' && nft.buyoffers">
        <div v-if="nft.buyoffers.length == 0">
          <p>
            Peerkat is not able to find any buy offers, shared with this wallet
            for this NFT
          </p>
        </div>
        <div v-else>
          <div
            v-for="(offer, index) in nft.buyoffers.sort(
              (a:any, b:any) => b.amount + b.amount
            )"
            :key="index"
            class="mt-4"
          >
            <buy-offer-card
              v-if="offer"
              :token="nft.currency"
              :owner="nft.owner"
              :offer="offer"
            ></buy-offer-card>
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
        one of your XLS20 NFTs in the “My Wallet” or “Shared with me” page views
      </li>
      <li class="pb-2">
        If you do not have any XLS20 NFTs in your wallet or that have been
        shared with you, please click here to find out how to get one.
      </li>
    </ul>
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

import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";
import { fetchBuyOffers } from "../services/XrpService";
import { openSignRequest } from "../utils/XummActions";
import { useRouter } from "vue-router";
import { getNetworkCodeFromType } from "../utils/getNetworkTypeFromCode";

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
    const router = useRouter();
    // const tokenID = route.params.id.toString();
    const nft = computed(() => store.getters["nft/getCurrent"]);
    const saleamount = ref(0);
    const toggleSellDialog = ref(false);

    const showTab = ref("buy");
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const nodetypecode = computed(() => getNetworkCodeFromType(nodetype.value));
    return {
      nft,
      saleamount,
      toggleSellDialog,
      showTab,
      openSellDialog() {
        //toggleSellDialog.value = true;
        router.push({
          path: `create_buy_offer`,
        });
      },
      async confirmSell() {
        devlog("isInXumm", isInXumm);

        if (isInXumm()) {
          devlog("isInXumm", isInXumm);

          const { created } = await XummSdk.createBuyOffer(
            {
              Account: walletAddress.value,
              NFTokenID: nft.value.currency,
              Owner: nft.value.owner,
              Amount: (saleamount.value * 1000000).toString(),
              User: user.value,
            },
            async () => {
              const { offers } = await fetchBuyOffers(nft.value.currency);

              await store.commit("nft/addBuyOffer", {
                offers: offers.filter(
                  (o: any) => o.owner == walletAddress.value
                ),
                nodetype: nodetype.value,
                walletaddress: user.value,
              });
              toggleSellDialog.value = false;
            }
          );
          devlog("create buy", created);
          const { uuid } = created;
          openSignRequest(uuid);
        } else {
          try {
            await store.dispatch("nft/createBuyOffer", {
              walletAddress: walletAddress.value,
              TokenID: nft.value.currency,
              Owner: nft.value.owner,
              Amount: saleamount.value,
            });
            toggleSellDialog.value = false;
          } catch (error) {
            devlog("CretaPayload", error);
          }
        }
      },
    };
  },
});
</script>
