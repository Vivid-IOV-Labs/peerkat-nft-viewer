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
      <async-button :on-click="accept">Accept</async-button>
      <div class="d-flex justify-content-between">
        <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl">
          Inspect</external-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import AsyncButton from "@/components/AsyncButton.vue";

import { getInspectorUrl } from "../utils/getInspectorUrl";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { acceptOffer } from "../services/XrpService";
export default defineComponent({
  components: {
    ExternalLink,
    AsyncButton,
  },
  props: {
    offer: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.offer.nft_offer_index)
    );

    return {
      bihompUrl,
      async accept() {
        await acceptOffer({ OfferID: props.offer.nft_offer_index });
        router.push({
          path: `/wallet`,
        });
      },
    };
  },
});
</script>
