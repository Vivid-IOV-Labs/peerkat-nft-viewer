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
          <strong class="h7 font-weight-bold">Sale Amount (XRP)</strong><br />
          <span class="mr-3">{{ Number(offer.amount) / 1000000 }} </span>
        </div>
        <strong class="h7 font-weight-bold">Flags </strong><br />
        <span class="mr-3">{{ offer.flags }} </span>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-between pb-4">
      <async-button :on-click="accept">Accept</async-button>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import AsyncButton from "@/components/AsyncButton.vue";

import { getInspectorUrl } from "../utils/getInspectorUrl";
import { isInXumm } from "../utils/isInXumm";
import { devlog } from "../utils/devlog";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { acceptOffer } from "../services/XrpService";
import XummSdk from "../services/XummService";
export default defineComponent({
  components: {
    AsyncButton,
  },
  props: {
    offer: { type: Object, required: true },
    nftId: { type: String, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const walletaddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.offer.nft_offer_index)
    );

    return {
      bihompUrl,
      async accept() {
        if (isInXumm()) {
          const { created } = await XummSdk.acceptOffer(
            {
              Account: walletaddress.value,
              OfferID: props.offer.nft_offer_index,
              User: user.value,
            },
            async () => {
              await store.commit("nft/deleteShared", {
                currency: props.nftId,
                nodetype: nodetype.value,
                walletaddress: user.value,
              });
              await store.commit("nft/resetAll");
              router.push({
                path: `/wallet?refresh="true"`,
                replace: true,
              });
            }
          );
          const { uuid } = created;
          XummSdk.openSignRequest(uuid);
        } else {
          await acceptOffer({
            OfferID: props.offer.nft_offer_index,
          });
          router.push({
            path: `/wallet`,
            replace: true,
          });
        }
      },
    };
  },
});
</script>
