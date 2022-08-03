<template>
  <div v-if="route.path == `/offers` && !nft">
    <h5 class="mt-4 text-center bold">An XLS-20 NFT has not been selected</h5>
    <ul class="mt-2 mb-4 p-2">
      <li class="pb-2">
        To view offers for an XLS-20 NFT, please select the “Offers” button on
        one of your XLS-20 NFTs in the “My Wallet” or “Shared with me” pages
      </li>
      <li class="pb-2">
        If you do not have any XLS-20 NFT that are in your wallet or have been
        shared with you, please click here to find out how to get one.
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

import { useStore } from "vuex";

import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const nft = computed(() => store.getters["nft/getCurrent"]);
    return {
      nft,
      route,
    };
  },
});
</script>
