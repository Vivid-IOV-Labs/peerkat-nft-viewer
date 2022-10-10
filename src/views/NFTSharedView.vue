<template>
  <div class="w-100 pt-0 p-1 text-center" style="overflow: scroll">
    <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>

    <div v-if="nft" class="w-100 p-1">
      <figure class="w-100 p4">
        <video
          v-if="nft.media_type?.includes('video')"
          :src="`${nft.url}`"
          poster="\loading.gif"
          muted
          autoplay
          loop
          class="img-fluid card-img"
          style="object-fit: cover; height: 100%; object-position: center top"
        ></video>
        <img
          v-else-if="nft.media_type?.includes('image')"
          v-lazy="nft.url"
          style="object-fit: cover; height: 100%; object-position: center top"
          class="img-fluid card-img"
          alt="Card
          image cap"
        />
        <img
          v-else
          :src="'/thumbnail.jpg'"
          style="object-fit: cover; height: 100%; object-position: center top"
          class="img-fluid card-img"
          alt="Card
          image cap"
        />
      </figure>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getNetworkTypeFromCode } from "../utils/getNetworkTypeFromCode";
export default defineComponent({
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
    // const mediaUrl = computed(() => {
    //   return ["XLS-14", "XLS-16"].includes(nft.value.standard) ||
    //     (["XLS-20"].includes(nft.value.standard) &&
    //       nft.value.url.split("//")[0] == "https:")
    //     ? nft.value.url
    //     : nft.value.url
    //     ? "https://dweb.link/ipfs/" + nft.value.url
    //     : "";
    // });
    return {
      nft,
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
