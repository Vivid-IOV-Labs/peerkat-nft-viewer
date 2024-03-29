<template>
  <video
    v-if="nft.media_type?.includes('video') && !loadingMedia"
    :src="thumbnailUrl + '#t=0.5'"
    :autoplay="autoplay"
    :controls="controls"
    preload="auto"
    loop
    muted
    playsinline
    webkit-playsinline
    class="img-fluid card-img-top"
    style="object-fit: cover; height: 100%; object-position: center center"
  ></video>
  <img
    v-else-if="nft.media_type?.includes('image') && !loadingMedia"
    v-lazy="thumbnailUrl"
    style="object-fit: cover; height: 100%; object-position: center center"
    class="img-fluid card-img-top"
    alt="Card
          image cap"
  />
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
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { getIpfsMedia, logFailedToLoad } from "../services/XrpService";
const useCache = import.meta.env.VITE_USE_CACHE;

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
    autoplay: { type: Boolean, default: () => false },
    controls: { type: Boolean, default: () => false },
    preview: { type: Boolean, default: () => true },
    shared: { type: Boolean, default: () => false },
  },
  async setup(props) {
    const store = useStore();
    const thumbnailUrl = ref("/loading.gif");
    const loadingMedia = ref(false);
    const user = computed(() => store.getters["user/getUser"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    async function fetchMedia() {
      if (props.nft.standard == "XLS-14" || props.nft.standard == "XLS-16") {
        const resp = await getIpfsMedia(props.nft.thumbnail || props.nft.url);
        thumbnailUrl.value = resp.url;
        const params = {
          tokenID: props.nft.currency,
          thumbnailUrl: thumbnailUrl.value,
          shared: { user: user.value, nodetype: nodetype.value },
        };
        await store.commit("nft/setXlsMediaUrlById", params);
      } else if (props.nft.standard == "XLS-14d/SOLO") {
        const resp = await getIpfsMedia(props.nft.url);
        thumbnailUrl.value = resp.url;

        const params = {
          tokenID: props.nft.currency,
          thumbnailUrl: thumbnailUrl.value,
          shared: props.shared
            ? { user: user.value, nodetype: nodetype.value }
            : false,
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
          const url =
            //  props.nft.type?.includes("video")
            //   ? `/apidev/assets/videos/${props.nft.currency}/video.${extnojpg}`
            //   :
            props.nft.type?.includes("animation")
              ? `/apidev/assets/animations/${props.nft.currency}/animation.${extnojpg}`
              : `/apidev/assets/images/${props.nft.currency}/200px/image.${extnojpg}`;
          const isReturned = await fetch(url, {
            method: "HEAD",
          });

          if (isReturned.ok && isReturned.status === 200) {
            thumbnailUrl.value = url;
            const params = {
              tokenID: props.nft.currency,
              thumbnailUrl: thumbnailUrl.value,
              shared: props.shared
                ? { user: user.value, nodetype: nodetype.value }
                : false,
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
          const linkkToMedia = props.nft.thumbnail || props.nft.url;
          if (linkkToMedia.includes("https") || linkkToMedia.includes("ipfs")) {
            thumbnailUrl.value = linkkToMedia;
          } else {
            const resp = await getIpfsMedia(linkkToMedia);
            thumbnailUrl.value = resp.url;
          }
        }
      }
    }
    if (props.nft.thumbnailUrl) {
      thumbnailUrl.value = props.nft.thumbnailUrl || props.nft.thumbnail;
    } else if (props.nft && (props.nft.thumbnail || props.nft.url)) {
      loadingMedia.value = true;
      await fetchMedia();
      loadingMedia.value = false;
    } else {
      //thumbnailUrl.value = null;
    }
    // const videoUrl = computed(() =>
    //   props.nft.thumbnailUrl ? mediaUrl.value : `${mediaUrl.value}#t=0.5`
    // );
    return {
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
</style>
