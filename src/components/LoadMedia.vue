<template>
  <video
    v-if="nft.media_type?.includes('video') && !loadingMedia"
    :src="mediaUrl"
    :poster="thumbnailUrl"
    muted
    class="img-fluid card-img-top"
    style="object-fit: cover; height: 100%; object-position: center center"
  ></video>
  <img
    v-else-if="nft.media_type?.includes('image') && !loadingMedia"
    v-lazy="lazyOptions"
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
import { computed, defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import { getIpfsMedia, logFailedToLoad } from "../services/XrpService";

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const mediaUrl = ref("");
    const store = useStore();
    const thumbnailUrl = ref("/loading.gif");
    const loadingMedia = ref(false);
    async function fetchMedia() {
      if (props.nft.url) {
        if (
          ["XLS-14", "XLS-16"].includes(props.nft.standard) ||
          (["XLS-20"].includes(props.nft.standard) &&
            props.nft.url.split("//")[0] == "https:")
        ) {
          mediaUrl.value = props.nft.url || "";
          thumbnailUrl.value = props.nft.thumbnail || "";
        } else {
          loadingMedia.value = true;
          try {
            const ext =
              props.nft.media_type && props.nft.media_type.split("/").pop()
                ? props.nft.media_type.split("/").pop()
                : props.nft.thumbnail
                ? props.nft.thumbnail.split(".").pop()
                : "jpg";
            const url = props.nft.media_type?.includes("video")
              ? `/apidev/assets/videos/${props.nft.currency}/full/video.${ext}`
              : `/apidev/assets/images/${props.nft.currency}/full/image.${ext}`;

            const isReturned = await fetch(url, {
              method: "HEAD",
            });

            if (isReturned.ok && isReturned.status === 200) {
              mediaUrl.value = url;
              const params = {
                tokenID: props.nft.currency,
                mediaUrl: mediaUrl.value,
                thumbnailUrl: thumbnailUrl.value,
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
            console.error("MEdia NOT isReturned " + props.nft.tokenName, err);

            const resp = await getIpfsMedia(props.nft.url);
            mediaUrl.value = resp.url;
          } finally {
            if (
              props.nft.media_type?.includes("video") &&
              props.nft.thumbnail
            ) {
              const resp = await getIpfsMedia(props.nft.thumbnail);
              thumbnailUrl.value = resp.url;
            }
            const params = {
              tokenID: props.nft.currency,
              mediaUrl: mediaUrl.value,
              thumbnailUrl: thumbnailUrl.value,
            };
            await store.commit("nft/setXls20MediaUrlById", params);
            loadingMedia.value = false;

            //  mediaUrl.value = "https://w3s.link/ipfs/" + props.nft.url;
            // mediaUrl.value = "https://peerkat.mypinata.cloud/ipfs/" + props.nft.url;
          }
        }
      }
    }
    if (props.nft.mediaUrl) {
      mediaUrl.value = props.nft.mediaUrl || "";
      thumbnailUrl.value = props.nft.thumbnailUrl || props.nft.thumbnail;
    } else {
      await fetchMedia();
    }

    // props.nft.url &&

    //   ? props.nft.url
    //   : props.nft.url
    //   ? "https://dweb.link/ipfs/" + props.nft.url
    //   : "";

    // .then((resp: any) => {
    //   mediaUrl.value = resp.url;
    //   debugger;
    // });

    const videoUrl = computed(() =>
      props.nft.standard == "XLS-20" && props.nft.thumbnail
        ? mediaUrl
        : `${mediaUrl.value}#t=0.5`
    );

    if (props.nft.media_type.includes("video")) {
      console.log("videoUrl", videoUrl.value);
    }

    const lazyOptions = reactive({
      src: mediaUrl.value,
      lifecycle: {
        // loading: (el: any) => {
        //   console.log("image loading", el);
        // },
        error: async (el: any) => {
          if (el && el.src) {
            if (!loadingMedia.value) {
              await fetchMedia();
              lazyOptions.src = mediaUrl.value;
            }
          }
        },
        // loaded: (el: any) => {
        //   console.log("image loaded", el);
        // },
      },
    });

    return {
      lazyOptions,
      mediaUrl,
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
</style>
