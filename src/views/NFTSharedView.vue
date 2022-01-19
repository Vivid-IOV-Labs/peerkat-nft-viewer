<template>
  <router-link :to="{ path: `/shared` }" class="mb-2 btn btn-link"
    >Back
  </router-link>
  <div v-if="nft" class="w-100 p4">
    <figure class="w-100 p4">
      <video
        v-if="nft.media_type?.includes('video')"
        :src="`${nft.url}#t=1`"
        poster="thumbnail.jpg"
        muted
        class="img-fluid card-img-top"
        style="object-fit: cover; height: 100%; object-position: center top"
      ></video>
      <img
        v-else-if="nft.media_type?.includes('image')"
        v-lazy="{
          src: nft.url,
          loading: 'thumbnail.jpg',
          error: 'thumbnail.jpg',
        }"
        style="object-fit: cover; height: 100%; object-position: center top"
        class="img-fluid card-img-top"
        alt="Card
          image cap"
      />
      <img
        v-else
        :src="'/thumbnail.jpg'"
        style="object-fit: cover; height: 100%; object-position: center top"
        class="img-fluid card-img-top"
        alt="Card
          image cap"
      />
    </figure>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getNetworkTypeFromCode } from "../utils/getNetworkTypeFromCode";
export default defineComponent({
  async setup() {
    const route = useRoute();
    const store = useStore();
    const nft = computed(() => {
      return store.getters["nft/getSharedByAddress"](
        route.params.nftAddress as string,
        getNetworkTypeFromCode(parseInt(route.params.nodetype as string))
      );
    });
    return {
      nft,
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
