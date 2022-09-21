<template>
  <div class="w-100 pt-0 p-1 text-center" style="overflow: scroll">
    <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>
    <div v-if="nft" class="w-100 p-1">
      <figure class="w-100">
        <video
          v-if="nft.media_type?.includes('video')"
          :src="`${nft.url}`"
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
export default defineComponent({
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { currency, nftAddress } = route.params;
    const nft = computed(() => {
      return store.getters["nft/getByAddress"](nftAddress, currency);
    });
    return {
      nft,
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
