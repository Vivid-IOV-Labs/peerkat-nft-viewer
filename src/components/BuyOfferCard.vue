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
        <div v-if="offer.amount" class="mt-2">
          <strong class="h7 font-weight-bold">Sale Amount (XRP)</strong><br />
          <span class="mr-3">{{ Number(offer.amount) / 1000000 }} </span>
        </div>
        <!-- <strong class="h7 font-weight-bold">Flags </strong><br />
        <span class="mr-3">{{ offer.flags }} </span> -->
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

import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";

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
  emits: { onCancel: null },
  async setup(props, { emit }) {
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);
    const user = computed(() => store.getters["user/getUser"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.token)
    );

    function shareUrl() {
      const xummSandbox = import.meta.env.VITE_XUMM_DEEPLINK;
      return `${xummSandbox}?redirect=/shared_buy_offers/${props.offer.nft_offer_index}/${props.token}/${props.owner}`;
    }

    return {
      bihompUrl,

      async cancelOffer() {
        if (isInXumm()) {
          const { created } = await XummSdk.cancelOffer(
            {
              TokenID: props.token,
              TokenIDs: [props.offer.nft_offer_index],
              User: user.value,
            },
            async () => {
              emit("onCancel");
              await store.commit("nft/deleteBuyOffer", {
                offerID: props.offer.nft_offer_index,
                nodetype: nodetype.value,
                walletaddress: user,
              });
            }
          );
          const { uuid } = created;
          XummSdk.openSignRequest(uuid);
        } else {
          await store.dispatch("nft/cancelBuyOffer", {
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
