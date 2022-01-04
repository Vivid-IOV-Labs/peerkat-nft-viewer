<template>
  <div
    v-if="sharedNFTs.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
  >
    <div v-for="nft in sharedNFTs" :key="nft.issuer" class="col-11">
      <nft-card :nft="nft"></nft-card>
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
import NftCard from "@/components/NftCard.vue";

export default defineComponent({
  components: {
    NftCard,
  },
  async setup() {
    const store = useStore();
    const sharedNFTs = computed(() => {
      return store.getters["nft/getShared"];
    });
    // const nft = localStorage.getItem("shared")
    //   ? JSON.parse(localStorage.getItem("shared") as string)
    //   : [];
    // if (localStorage.getItem("shared")) {
    //   console.log(localStorage.getItem("shared"));
    // }
    console.log(sharedNFTs.value);
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
