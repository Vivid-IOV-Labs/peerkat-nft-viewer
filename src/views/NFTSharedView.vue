<template>
  <div style="height: 70vh">
    <BackLink />
    <div v-if="nft" class="h-100">
      <figure class="w-100">
        <load-media :autoplay="true" :nft="nft"></load-media>
      </figure>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getNetworkTypeFromCode } from "../utils/getNetworkTypeFromCode";
import LoadMedia from "@/components/LoadMedia.vue";
import BackLink from "@/components/BackLink.vue";

export default defineComponent({
  components: {
    LoadMedia,
    BackLink,
  },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const nft = computed(() => {
      const { currency, nftAddress, nodetype } = route.params;

      return store.getters["nft/getSharedByAddress"](
        nftAddress,
        getNetworkTypeFromCode(parseInt(nodetype as string)),
        currency
      );
    });

    return {
      nft,
      back() {
        router.push({ path: "/shared" });
      },
    };
  },
});
</script>
