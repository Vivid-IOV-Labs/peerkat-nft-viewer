<template>
  <router-link :to="{ path: `/` }" class="my-4 btn btn-link">Back </router-link>
  nft view
  <!-- <div v-if="nft" class="d-flex h-88 justify-center items-center">
    <figure>
      <img
        v-if="nft.media_type?.includes('image')"
        class="card-img"
        :src="nft.url"
        alt="Card image cap"
        @error="fallbackImg"
      />
    </figure>
    <video
      v-if="nft.media_type?.includes('video')"
      :src="nft.url"
      autoplay
      muted
      loop
      playsinline
      class="w-100 card-img"
    ></video>
  </div> -->
</template>

<script lang="ts">
import { defineComponent, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();

    // const nft = computed(() => {
    //   return store.getters["nft/getByAddress"](
    //     route.params.nftAddress as string
    //   );
    // });
    return {
      // nft,
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
    };
  },
});
</script>
