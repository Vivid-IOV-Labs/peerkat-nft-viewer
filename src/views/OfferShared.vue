<template>
  <div
    v-for="selloffer in sharedSellOffers"
    :key="selloffer.offer.nft_offer_index"
    class="mt-4"
  >
    <sell-card
      v-if="selloffer.offer"
      :token="selloffer.nft.currency"
      :offer="selloffer.offer"
    ></sell-card>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import SellCard from "@/components/SellCard.vue";

export default defineComponent({
  components: {
    SellCard,
  },
  async setup() {
    const store = useStore();
    const sharedSellOffers = computed(() => {
      return store.getters["nft/getSharedSellOffers"];
    });
    return {
      sharedSellOffers,
    };
  },
});
</script>
