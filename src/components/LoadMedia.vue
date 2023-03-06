<template>
  <video
    v-if="nft.media_type?.includes('video') && !loadingMedia"
    :src="videoUrl"
    :poster="thumbnailUrl"
    :autoplay="autoplay"
    loop
    muted
    playsinline
    webkit-playsinline
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
    autoplay: { type: Boolean, default: () => false },
  },
  async setup(props) {
    const mediaUrl = ref("");
    const store = useStore();
    const thumbnailUrl = ref("/loading.gif");
    const loadingMedia = ref(false);

    async function fetchMedia() {
      if (props.nft.standard == "XLS-14" || props.nft.standard == "XLS-16") {
        mediaUrl.value = props.nft.url;
        thumbnailUrl.value = props.nft.thumbnail;

        const params = {
          tokenID: props.nft.currency,
          mediaUrl: mediaUrl.value,
          thumbnailUrl: thumbnailUrl.value,
        };
        await store.commit("nft/setXlsMediaUrlById", params);
      } else if (props.nft.standard == "XLS-14d/SOLO") {
        const resp = await getIpfsMedia(props.nft.url);
        mediaUrl.value = resp.url;
        console.log(mediaUrl.value);
        console.log(props.nft);
        const params = {
          tokenID: props.nft.currency,
          mediaUrl: mediaUrl.value,
          thumbnailUrl: thumbnailUrl.value,
        };
        // console.log(mediaUrl.value);
        // console.log(props.nft);
        await store.commit("nft/setXlsMediaUrlById", params);
      } else {
        try {
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
          // thumbnailUrl.value = `/apidev/assets/images/${props.nft.currency}/200px/image.${ext}`;

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
          if (props.nft.url.includes("https")) {
            mediaUrl.value = props.nft.url;
          } else {
            const resp = await getIpfsMedia(props.nft.url);
            mediaUrl.value = resp.url;
          }
        } finally {
          if (props.nft.media_type?.includes("video") && props.nft.thumbnail) {
            const resp = await getIpfsMedia(props.nft.thumbnail);

            thumbnailUrl.value = resp.url;
          }
          const params = {
            tokenID: props.nft.currency,
            mediaUrl: mediaUrl.value,
            thumbnailUrl: thumbnailUrl.value,
          };
          await store.commit("nft/setXls20MediaUrlById", params);

          //  mediaUrl.value = "https://w3s.link/ipfs/" + props.nft.url;
          // mediaUrl.value = "https://peerkat.mypinata.cloud/ipfs/" + props.nft.url;
        }
      }
    }
    if (props.nft.mediaUrl) {
      mediaUrl.value = props.nft.mediaUrl || "";
      thumbnailUrl.value = props.nft.thumbnailUrl || props.nft.thumbnail;
    } else if (props.nft && props.nft.url && props.nft.standard) {
      loadingMedia.value = true;
      await fetchMedia();
      loadingMedia.value = false;
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
      props.nft.thumbnailUrl ? mediaUrl : `${mediaUrl.value}#t=0.5`
    );

    // if (props.nft.media_type.includes("video")) {
    //   console.log("videoUrl", videoUrl.value);
    // }

    // const lazyOptions = reactive({
    //   src: mediaUrl.value,
    //   lifecycle: {
    //     // loading: (el: any) => {
    //     //   console.log("image loading", el);
    //     // },
    //     error: async (el: any) => {
    //       if (el && el.src) {
    //         if (!loadingMedia.value) {
    //           await fetchMedia();
    //           lazyOptions.src = mediaUrl.value;
    //         }
    //       }
    //     },
    //     // loaded: (el: any) => {
    //     //   console.log("image loaded", el);
    //     // },
    //   },
    // });
    return {
      //lazyOptions,
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
