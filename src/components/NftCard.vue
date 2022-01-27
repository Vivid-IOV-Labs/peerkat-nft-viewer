<template>
  <base-card>
    <template #picture>
      <figure style="overflow: hidden; height: 100%">
        <a
          class="h-100 d-block"
          style="overflow: hidden"
          href="#"
          @click.prevent="view"
        >
          <video
            v-if="nft.media_type?.includes('video')"
            :src="`${nft.url}#t=0.5`"
            poster="/thumbnail.jpg"
            muted
            class="img-fluid card-img-top"
            style="object-fit: cover; height: 100%; object-position: center top"
          ></video>
          <img
            v-else-if="nft.media_type?.includes('image')"
            v-lazy="nft.url"
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
        </a>
      </figure>
    </template>

    <template #title>
      <strong class="h6 font-weight-bold">Token Name </strong><br />
      {{ nft.tokenName }}
    </template>
    <template #text>
      <strong class="h7 font-weight-bold">Issuer </strong><br />
      <span>{{ nft.issuer }}</span
      ><br />
      <strong class="h7 font-weight-bold mt-2">Balance </strong>
      <span class="mr-3">{{ nft.balanceFormatted }} </span>
      <strong class="h7 font-weight-bold">Total Supply </strong>
      <span>{{ nft.limitFormatted }}</span>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="share">Share</base-button>
        <external-link class="mr-2" :url="bihompUrl" @click="trackInspect">
          Inspect</external-link
        >
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { copyText } from "../utils/copytext";
import { useStore } from "vuex";
import { getNetworkCodeFromType } from "../utils/getNetworkTypeFromCode";
import { trackEvent } from "../utils/analytics";

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const bihompUrl = computed(() =>
      nodetype.value == "TESTNET"
        ? `https://test.bithomp.com/explorer/${props.nft.issuer}`
        : `https://bithomp.com/explorer/${props.nft.issuer}`
    );
    return {
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      bihompUrl,
      share() {
        const nodetypecode = getNetworkCodeFromType(nodetype.value);

        const params = {
          title: "Share NFT link",
          text: "Copied to clipboard",
        };

        const xummSandbox = import.meta.env.VITE_XUMM_SANDOX;
        const url =
          xummSandbox === "test"
            ? `https://xumm.app/detect/xapp:peerkat.sandbox.test?redirect=/shared/${props.nft.issuer}/${nodetypecode}`
            : `https://xumm.app/detect/xapp:peerkat.sandbox?redirect=/shared/${props.nft.issuer}/${nodetypecode}`;
        copyText(url, params);
        trackEvent({
          category: " Wallet View",
          action: "click-share",
          label: props.nft.issuer,
        });
      },
      view() {
        router.push({
          path: `/wallet/${props.nft.issuer}/view`,
        });
        trackEvent({
          category: "Wallet View",
          action: "view-nft",
          label: props.nft.issuer,
        });
      },
      trackInspect() {
        trackEvent({
          category: " Share with me View",
          action: "click-inspect",
          label: props.nft.issuer,
        });
      },
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
