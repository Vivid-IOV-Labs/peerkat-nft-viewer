<template>
  <video
    v-if="nft.media_type?.includes('video') && !loadingMedia"
    :src="videoUrl"
    :poster="thumbnailUrl"
    muted
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
import { computed, defineComponent, ref } from "vue";
import { getIpfsMedia } from "../services/XrpService";

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
  },
  setup(props) {
    const mediaUrl = ref("");
    const thumbnailUrl = ref("/loading.gif");
    const loadingMedia = ref(false);

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
        getIpfsMedia(props.nft.url).then((resp: any) => {
          loadingMedia.value = false;
          mediaUrl.value = resp.url;
        });

        if (props.nft.media_type?.includes("video") && props.nft.thumbnail) {
          console.log(props.nft.thumbnail);
          getIpfsMedia(props.nft.thumbnail).then((resp: any) => {
            thumbnailUrl.value = resp.url;
          });
        }

        //  mediaUrl.value = "https://w3s.link/ipfs/" + props.nft.url;
        // mediaUrl.value = "https://peerkat.mypinata.cloud/ipfs/" + props.nft.url;
      }
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

    return {
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