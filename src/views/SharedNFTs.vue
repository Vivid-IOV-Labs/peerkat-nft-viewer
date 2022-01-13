<template>
  <div
    v-if="sharedNFTs.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
  >
    <div v-for="nft in sharedNFTs" :key="nft.issuer" class="col-11">
      <nft-shared-card :nft="nft"></nft-shared-card>
    </div>
  </div>
  <div
    v-else
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
    "
  >
    <h3 class="text-center mt-4">
      There are no NFTs shared with you at the moment
    </h3>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { useStore } from "vuex";
import NftSharedCard from "@/components/NftSharedCard.vue";

export default defineComponent({
  components: {
    NftSharedCard,
  },
  async setup() {
    const store = useStore();
    const ottData = computed(() => store.getters("xumm/getOttData"));
    const sharedNFTs = computed(() => {
      return store.getters["nft/getShared"](
        ottData.value.nodetype.toLowerCase()
      );
    });
    return {
      sharedNFTs,
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
