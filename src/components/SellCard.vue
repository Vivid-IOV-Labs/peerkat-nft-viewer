<template>
  <div v-if="offer" class="card">
    <div class="card-body">
      <div class="card-title mt-1">
        <strong class="h6 font-weight-bold">NFT Offer Index </strong><br />
        {{ offer.nft_offer_index }}
      </div>
      <div class="card-text">
        <!-- <strong class="h7 font-weight-bold">Owner </strong><br />
        <span>{{ offer.owner }}</span> -->

        <!-- <strong class="h7 font-weight-bold">Flags </strong><br />
        <span class="mr-3">{{ offer.flags }} </span> -->
        <div v-if="offer.destination" class="mt-2">
          <strong class="h7 font-weight-bold">Destination </strong><br />
          <span class="mr-3">{{ offer.destination }} </span>
        </div>
        <div v-if="offer.amount" class="mt-2">
          <div v-if="Number(offer.amount)">
            <strong class="h7 font-weight-bold">Price (XRP)</strong><br />
            <span class="mr-3">{{ Number(offer.amount) / 1000000 }} </span>
          </div>
          <div v-else-if="offer.amount.value">
            <strong class="h7 font-weight-bold">Price (Issued Token)</strong
            ><br />
            <span class="mr-3">{{ offer.amount.value }} </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="card-footer mt-auto d-flex justify-content-between pb-4">
       <async-button :on-click="cancelOffer">Cancel</async-button>
      <div class="d-flex justify-content-between">
        <base-button class="mr-2" @click="share">Share</base-button>
      </div> 
    </div> -->
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
// import BaseButton from "@/components/BaseButton.vue";
// import AsyncButton from "@/components/AsyncButton.vue";

import { copyText } from "../utils/copytext";
import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";
import { useStore } from "vuex";
import { openSignRequest } from "../utils/XummActions";

export default defineComponent({
  // components: {
  //   BaseButton,
  //   AsyncButton,
  // },
  props: {
    offer: { type: Object, required: true },
    token: { type: String, required: true },
  },
  async setup(props) {
    const store = useStore();
    function shareUrl() {
      const xummSandbox = import.meta.env.VITE_XUMM_DEEPLINK;
      return `${xummSandbox}?redirect=/shared_sell_offers/${props.offer.nft_offer_index}/${props.token}/${props.offer.owner}`;
    }
    const price = computed(() => {});
    return {
      async cancelOffer() {
        if (isInXumm()) {
          const { created } = await XummSdk.cancelOffer(
            {
              TokenID: props.token,
              TokenIDs: [props.offer.nft_offer_index],
            },
            async () => {
              await store.commit("nft/deleteSellOffer", {
                offerID: props.offer.nft_offer_index,
              });
            }
          );
          const { uuid } = created;
          // XummSdk.openSignRequest(uuid);
          openSignRequest(uuid);
        } else {
          await store.dispatch("nft/cancelOffer", {
            TokenID: props.token,
            OfferID: props.offer.nft_offer_index,
          });
        }
      },
      share() {
        const params = {
          title: "Share Offer NFT link",
          text: "Copied to clipboard",
        };

        const url = shareUrl();
        copyText(url, params);
      },
    };
  },
});
</script>
