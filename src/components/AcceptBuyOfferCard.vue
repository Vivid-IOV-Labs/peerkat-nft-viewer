<template>
  <div v-if="offer" class="card">
    <div class="card-body">
      <div class="card-title mt-1">
        <strong class="h6 font-weight-bold">NFT Offer Index </strong><br />
        {{ offer.nft_offer_index }}
      </div>
      <div class="card-text">
        <strong class="h7 font-weight-bold">Offer From </strong><br />
        <span>{{ offer.owner }}</span>
        <div v-if="offer.expiration" class="mt-2">
          <strong class="h7 font-weight-bold">Offer Expires</strong><br />
          <span class="mr-3">{{ expirationDate }} </span>
        </div>
        <div v-if="offer.amount" class="mt-2">
          <strong class="h7 font-weight-bold">Price (XRP)</strong><br />
          <span class="mr-3">{{ Number(offer.amount) / 1000000 }} </span>
        </div>
        <!-- <strong class="h7 font-weight-bold">Flags </strong><br />
        <span class="mr-3">{{ offer.flags }} </span> -->
      </div>
    </div>
    <!-- <div class="card-footer mt-auto d-flex justify-content-between pb-4">
      <async-button :on-click="accept">Accept</async-button>
    </div> -->
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import AsyncButton from "@/components/AsyncButton.vue";

import { getInspectorUrl } from "../utils/getInspectorUrl";
import { isInXumm } from "../utils/isInXumm";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { acceptBuyOffer } from "../services/XrpService";
import XummSdk from "../services/XummService";
import format from "date-fns/format";
import enUS from "date-fns/locale/en-US";
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
    const walletaddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.offer.nft_offer_index)
    );
    const expirationDate = computed(() => {
      if (props.offer.expiration) {
        return format(props.offer.expiration * 1000, "YYY MMM dd", {
          locale: enUS,
        });
      } else return null;
    });
    return {
      bihompUrl,
      expirationDate,
      async accept() {
        if (isInXumm()) {
          const { created } = await XummSdk.acceptBuyOffer(
            {
              Account: walletaddress.value,
              OfferID: props.offer.nft_offer_index,
              User: user.value,
            },
            async () => {
              await store.commit("nft/resetAll");
              await store.commit("nft/deleteShared", {
                currency: props.nftId,
                nodetype: nodetype.value,
                walletaddress: user.value,
              });
              router.push({
                path: `/wallet?refresh="true"`,
                replace: true,
              });
            }
          );
          const { uuid } = created;
          XummSdk.openSignRequest(uuid);
        } else {
          await acceptBuyOffer({
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
