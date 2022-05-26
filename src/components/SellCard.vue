<template>
  <div class="card">
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
      <base-button>Cancel</base-button>
      <div class="d-flex justify-content-between">
        <base-button>Share</base-button> <base-button>Inspect</base-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseButton from "@/components/BaseButton.vue";

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    offer: { type: Object, required: true },
  },
  async setup() {
    return {};
  },
});
</script>
