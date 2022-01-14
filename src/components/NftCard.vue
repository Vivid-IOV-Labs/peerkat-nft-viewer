<template>
  <base-card style="height: 100%">
    <template #picture>
      <figure class="h-50">
        <a href="#" @click.prevent="view">
          <video
            v-if="nft.media_type?.includes('video')"
            :src="`${nft.url}#t=0.5`"
            preload="metadata"
            muted
            class="img-fluid card-img-top"
            style="object-fit: cover; height: 100%; object-position: center top"
          ></video>
          <img
            v-else
            style="object-fit: cover; height: 100%; object-position: center top"
            class="img-fluid card-img-top"
            :src="nft.url"
            alt="Card image cap"
            @error="fallbackImg"
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
      <span>{{ nft.issuer }}</span>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="share">Share</base-button>
        <external-link class="mr-2" :url="bihompUrl"> Inspect</external-link>
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
        copyText(
          `https://xumm.app/detect/xapp:peerkat.sandbox?redirect=/shared/${props.nft.issuer}/${nodetypecode}`
        );
      },
      view() {
        router.push({
          path: `/wallet/${props.nft.issuer}/view`,
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
