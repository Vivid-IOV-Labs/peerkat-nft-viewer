<template>
  <video
    v-if="nft.media_type?.includes('video') && !loadingMedia"
    ref="video"
    :src="mediaUrl"
    :poster="thumbnailUrl"
    :autoplay="autoplay"
    loop
    muted
    playsinline
    class="img-fluid card-img-top"
    style="object-fit: cover; height: 100%; object-position: center center"
  ></video>
  <img
    v-else-if="nft.media_type?.includes('image') && !loadingMedia"
    v-lazy="mediaUrl"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
    alt="Card
          image cap"
  />
  <svg
    v-else-if="nft.media_type?.includes('xml') && !loadingMedia"
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
const useCache = import.meta.env.VITE_USE_CACHE;

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
    autoplay: { type: Boolean, default: () => false },
    controls: { type: Boolean, default: () => false },
    preview: { type: Boolean, default: () => true },
  },

  async setup(props) {
    const mediaUrl = ref("");
    const store = useStore();
    const thumbnailUrl = ref("/loading.gif");
    const loadingMedia = ref(false);
    const nodetype = computed(() => store.getters["user/getNodeType"]);

    const video = ref<any>();
    const startplay = ref(false);
    async function fetchMedia() {
      if (props.nft.standard == "XLS-14" || props.nft.standard == "XLS-16") {
        mediaUrl.value = props.nft.url;

        const params = {
          tokenID: props.nft.currency,
          mediaUrl: mediaUrl.value,
        };
        await store.commit("nft/setXlsMediaUrlById", params);
      } else if (props.nft.standard == "XLS-14d/SOLO") {
        const resp = await getIpfsMedia(props.nft.url);
        mediaUrl.value = resp.url;

        const params = {
          tokenID: props.nft.currency,
          mediaUrl: mediaUrl.value,
        };

        await store.commit("nft/setXlsMediaUrlById", params);
      } else {
        try {
          if (!useCache) {
            throw new Error("not cahce in use");
          }
          const ext =
            props.nft.media_type && props.nft.media_type.split("/").pop()
              ? props.nft.media_type.split("/").pop()
              : props.nft.thumbnail
              ? props.nft.thumbnail.split(".").pop()
              : "jpg";

          const extnojpg = ext.replace("jpg", "jpeg");

          const url = props.nft.type?.includes("video")
            ? `/apidev/assets/videos/${props.nft.currency}/video.${extnojpg}`
            : props.nft.type?.includes("animation")
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
            };
            await store.commit("nft/setXls20MediaUrlById", params);
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
          if (props.nft.url.includes("https")) {
            mediaUrl.value = props.nft.url;
          } else {
            const resp = await getIpfsMedia(props.nft.url);
            mediaUrl.value = resp.url;
          }
        }
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

    if (props.nft.mediaUrl) {
      mediaUrl.value = props.nft.mediaUrl || "";
    } else if (props.nft && props.nft.url && props.nft.standard) {
      loadingMedia.value = true;
      await fetchMedia();
      loadingMedia.value = false;
    }

    const videoUrl = computed(() =>
      props.nft.thumbnailUrl ? mediaUrl.value : `${mediaUrl.value}#t=0.5`
    );

    return {
      video,
      mediaUrl,
      startplay,
      videoUrl,
      loadingMedia,
      thumbnailUrl,
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
