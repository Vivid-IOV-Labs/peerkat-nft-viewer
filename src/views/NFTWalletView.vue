<template>
  <div class="w-100 pt-0 p-1 text-center" style="overflow: scroll">
    <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>
    <div v-if="nft" class="w-100 p-1">
      <figure class="w-100">
        <video
          v-if="nft.media_type?.includes('video') && !loadingMedia"
          :src="`${mediaUrl}#t=0.5`"
          poster="\loading.gif"
          muted
          class="img-fluid card-img-top"
          style="object-fit: cover; height: 100%; object-position: center top"
        ></video>
        <img
          v-else-if="nft.media_type?.includes('image') && !loadingMedia"
          v-lazy="mediaUrl"
          style="object-fit: cover; height: 100%; object-position: center top"
          class="img-fluid card-img-top"
          alt="Card
          image cap"
        />
        <img
          v-else-if="loadingMedia && !mediaUrl"
          :src="'/loading.gif'"
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
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getIpfsMedia } from "../services/XrpService";
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const mediaUrl = ref("");
    const loadingMedia = ref(true);
    const { currency, nftAddress } = route.params;
    const nft = computed(() => {
      return store.getters["nft/getByAddress"](nftAddress, currency);
    });

    watch(
      nft,
      async (newNft: any) => {
        if (newNft) {
          if (newNft.url) {
            if (
              ["XLS-14", "XLS-16"].includes(newNft.standard) ||
              (["XLS-20"].includes(newNft.standard) &&
                newNft.url.split("//")[0] == "https:")
            ) {
              mediaUrl.value = newNft.url;
              loadingMedia.value = false;
            } else {
              const resp = await getIpfsMedia(newNft.url);
              mediaUrl.value = resp.url;
              loadingMedia.value = false;
            }
          }
        }
      },
      { immediate: true }
    );

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
      mediaUrl,
      loadingMedia,
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
