<template>
  <video
    v-if="nft.thumbnailType?.includes('video') && !loadingMedia"
    :src="thumbnailUrl + '#t=0.5'"
    :autoplay="autoplay"
    :controls="controls"
    loop
    muted
    playsinline
    webkit-playsinline
    class="img-fluid card-img-top"
    style="object-fit: cover; height: 100%; object-position: center center"
  ></video>
  <img
    v-else-if="nft.thumbnailType?.includes('image') && !loadingMedia"
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
    const walletaddress = computed(() => store.getters["user/getAddress"]);
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
          if (nodetype.value !== "MAINNET") {
            throw new Error("not mainnet");
          }
          // const ext =
          //   props.nft.thumbnailType && props.nft.thumbnailType.split("/").pop()
          //     ? props.nft.thumbnailType.split("/").pop()
          //     : props.nft.thumbnail;

          // const extnojpg = ext.replace("jpg", "jpeg");

          const url = `/apidev/assets/images/${props.nft.currency}/200px/image`;
          // thumbnailUrl.value = `/apidev/assets/images/${props.nft.currency}/200px/image.${ext}`;
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
          if (props.nft.thumbnail && props.nft.thumbnail.includes("https")) {
            thumbnailUrl.value = props.nft.thumbnail;
          } else {
            const resp = await getIpfsMedia(props.nft.thumbnail);
            thumbnailUrl.value = resp.url;
          }
        } finally {
          const params = {
            tokenID: props.nft.currency,
            thumbnailUrl: thumbnailUrl.value,
            shared: props.shared
              ? { user: user.value, nodetype: nodetype.value }
              : false,
          };
          await store.commit("nft/setXls20MediaUrlById", params);
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
