<template>
  <div v-if="offer" class="card">
    <div class="card-body">
      <div class="card-title mt-1">
        <strong class="h6 font-weight-bold">NFT Offer Index </strong><br />
        {{ offer.nft_offer_index }}
      </div>
      <div class="card-text">
        <strong class="h7 font-weight-bold">Owner </strong><br />
        <span>{{ offer.owner }}</span>
        <div v-if="offer.amount" class="mt-2">
          <strong class="h7 font-weight-bold">Sale Amount </strong><br />
          <span class="mr-3">{{ offer.amount }} </span>
        </div>
        <strong class="h7 font-weight-bold">Flags </strong><br />
        <span class="mr-3">{{ offer.flags }} </span>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-between pb-4">
      <async-button :on-click="cancelOffer">Cancel</async-button>
      <div class="d-flex justify-content-between">
        <base-button class="mr-2" @click="share">Share</base-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import AsyncButton from "@/components/AsyncButton.vue";

import { copyText } from "../utils/copytext";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    BaseButton,
    AsyncButton,
  },
  props: {
    offer: { type: Object, required: true },
    token: { type: String, required: true },
    owner: { type: String, required: true },
  },
  async setup(props) {
    console.log(props.offer);
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.token)
    );

    function shareUrl() {
      const xummSandbox = import.meta.env.VITE_XUMM_SANDBOX;
      return xummSandbox === "test"
        ? `https://xumm.app/detect/xapp:peerkat.sandbox.test?redirect=/shared_buy_offers/${props.offer.nft_offer_index}/${props.token}/${props.owner}`
        : xummSandbox === "dev"
        ? `https://xumm.app/detect/xapp:peerkat.dev?redirect=/shared_buy_offers/${props.offer.nft_offer_index}/${props.token}/${props.owner}`
        : `https://xumm.app/detect/xapp:peerkat.viewer?redirect=/shared_buy_offers/${props.offer.nft_offer_index}/${props.token}/${props.owner}`;
    }
    return {
      bihompUrl,
      async cancelOffer() {
        await store.dispatch("nft/cancelBuyOffer", {
          TokenID: props.token,
          OfferID: props.offer.nft_offer_index,
        });
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
