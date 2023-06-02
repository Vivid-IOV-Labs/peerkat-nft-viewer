<template>
  <video
    v-if="nftAsset.media_type?.includes('video') && !loadingMedia"
    ref="video"
    :src="videoUrl"
    :poster="poster"
    :autoplay="autoplay"
    loop
    muted
    playsinline
    class="img-fluid card-img-top"
    style="object-fit: cover; height: 100%; object-position: center center"
  ></video>
  <img
    v-else-if="nftAsset.media_type?.includes('image') && !loadingMedia"
    v-lazy="mediaUrl"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
    alt="Card
          image cap"
  />
  <svg
    v-else-if="nftAsset.media_type?.includes('xml') && !loadingMedia"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
  >
    <image
      style="
        object-fit: cover;
        height: 100%;
        width: 100%;
        object-position: center center;
      "
      :xlink:href="mediaUrl"
      src="/thumbnail.jpg"
    />
  </svg>
  <img
    v-else-if="loadingMedia"
    :src="'/loading.gif'"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
    alt="Card
          image cap"
  />
  <img
    v-else
    :src="'/thumbnail.jpg'"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
    alt="Card
          image cap"
  />
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { getIpfsMedia, logFailedToLoad } from "../services/XrpService";

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
    asset: { type: String, required: true },
    autoplay: { type: Boolean, default: () => false },
    controls: { type: Boolean, default: () => false },
    preview: { type: Boolean, default: () => true },
  },

  async setup(props) {
    const mediaUrl = ref("");
    const store = useStore();
    const loadingMedia = ref(false);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const nftAsset = computed(() => props.nft.assets[props.asset]);
    const video = ref<any>();
    const startplay = ref(false);
    async function fetchMedia() {
      try {
        if (nodetype.value !== "MAINNET") {
          throw new Error("not mainnet");
        }
        const ext =
          nftAsset.value.media_type &&
          nftAsset.value.media_type.split("/").pop()
            ? nftAsset.value.media_type.split("/").pop()
            : nftAsset.value.thumbnail
            ? nftAsset.value.thumbnail.split(".").pop()
            : "jpg";
        const extnojpg = ext.replace("jpg", "jpeg");

        const url = nftAsset.value.media_type?.includes("video")
          ? `/apidev/assets/videos/${props.nft.currency}/video.${extnojpg}`
          : nftAsset.value.media_type?.includes("animation")
          ? `/apidev/assets/animations/${props.nft.currency}/animation.${extnojpg}`
          : `/apidev/assets/images/${props.nft.currency}/full/image.${extnojpg}`;
        const isReturned = await fetch(url, {
          method: "HEAD",
        });
        if (isReturned.ok && isReturned.status === 200) {
          mediaUrl.value = url;
          const params = {
            tokenID: props.nft.currency,
            mediaUrl: mediaUrl.value,
            asset: props.asset,
          };
          await store.commit("nft/setXls20AssetById", params);
        } else {
          const t = await logFailedToLoad({
            Issuer: props.nft.issuer,
            NFTokenID: props.nft.currency,
            URI: props.nft.URI,
            Domain: props.nft.Domain,
            NFTokenTaxon: props.nft.tokenTaxon,
            Source: "xummapp-frontend",
          });

          throw new Error("Error Status:" + isReturned.status);
        }
      } catch (err) {
        if (nftAsset.value.url.includes("https")) {
          mediaUrl.value = nftAsset.value.url;
        } else {
          const resp = await getIpfsMedia(nftAsset.value.url);
          mediaUrl.value = resp.url;
        }
        const params = {
          tokenID: props.nft.currency,
          mediaUrl: mediaUrl.value,
          asset: props.asset,
        };
        await store.commit("nft/setXls20AssetById", params);
      }
    }
    onMounted(() => {
      if (video.value) {
        video.value.oncanplaythrough = (event: Event) => {
          if (props.autoplay) {
            startplay.value = true;
            video.value.controls = true;
          }
        };
      }
    });

    if (nftAsset.value.mediaUrl) {
      mediaUrl.value = nftAsset.value.mediaUrl || "";
    } else if (nftAsset.value && nftAsset.value.url) {
      loadingMedia.value = true;
      await fetchMedia();
      loadingMedia.value = false;
    }

    const videoUrl = computed(() =>
      nftAsset.value.thumbnailUrl ? mediaUrl.value : `${mediaUrl.value}#t=0.5`
    );
    const poster = computed(() =>
      loadingMedia.value
        ? "/loading.gif"
        : !loadingMedia.value && nftAsset.value.thumbnailUrl
        ? nftAsset.value.thumbnailUrl
        : `${mediaUrl.value}#t=0.5`
    );

    //cloudflare-ipfs.com/ipfs/QmfQGVwoxpqnAvDxFxW7bPsesivFas7FFjBcW9tVU5ymZQ

    return {
      video,
      mediaUrl,
      startplay,
      videoUrl,
      loadingMedia,
      poster,
      nftAsset,
    };
  },
});
</script>
<style>
.truncate {
  min-width: 180px;
  max-width: 200px;
  width: 100%;
}
.untruncate {
  min-width: auto;
  max-width: auto;
}
video::-webkit-media-controls {
  visibility: hidden;
}

video::-webkit-media-controls-enclosure {
  visibility: visible;
}
</style>
