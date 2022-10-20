<template>
  <div style="height: 60vh; overflow: hidden" class="w-100 p-1">
    <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>

    <div v-if="nft" class="h-100">
      <transition>
        <figure v-if="mediaUrl && !loadingMedia" class="w-100">
          <video
            v-if="nft.media_type?.includes('video') && !loadingMedia"
            :src="`${mediaUrl}#t=0.5`"
            poster="\loading.gif"
            autoplay
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
        <div v-else class="w-100 h-100">
          <img
            :src="'/loading.gif'"
            style="object-fit: cover; height: 100%; object-position: center top"
            class="img-fluid card-img-top"
            alt="Card
          image cap"
          />
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getIpfsMedia } from "../services/XrpService";
import { delay } from "../utils/delay";
import { getNetworkTypeFromCode } from "../utils/getNetworkTypeFromCode";
export default defineComponent({
  async setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const mediaUrl = ref("");
    const loadingMedia = ref(true);
    const nft = computed(() => {
      const { currency, nftAddress, nodetype } = route.params;

      return store.getters["nft/getSharedByAddress"](
        nftAddress,
        getNetworkTypeFromCode(parseInt(nodetype as string)),
        currency
      );
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
              await delay(400);

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
        router.push({ path: "/shared" });
      },
    };
  },
});
</script>
