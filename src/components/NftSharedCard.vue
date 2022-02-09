<template>
  <base-card style="height: 100%">
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
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="deleteShared">Delete</base-button>
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
    const walletaddress = computed(() => store.getters["user/getAddress"]);
    const nodetypecode = computed(() => getNetworkCodeFromType(nodetype.value));
    const bihompUrl = computed(() =>
      nodetype.value == "TESTNET"
        ? `https://test.bithomp.com/explorer/${props.nft.issuer}`
        : `https://bithomp.com/explorer/${props.nft.issuer}`
    );
    return {
      bihompUrl,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        router.push({
          path: `/shared/${props.nft.issuer}/${nodetypecode.value}/view`,
        });
        trackEvent({
          category: "Share with me View",
          action: "view-nft",
          label: props.nft.issuer,
        });
      },
      deleteShared() {
        store.commit("nft/deleteShared", {
          issuer: props.nft.issuer,
          nodetype: nodetype.value,
          walletaddress: walletaddress.value,
        });
        trackEvent({
          category: " Share with me View",
          action: "click-delete",
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
