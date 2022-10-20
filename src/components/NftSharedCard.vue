<template>
  <base-card style="height: 100%">
    <template #picture>
      <figure style="overflow: hidden; height: 100%">
        error{{ nft.error_code }}
        <a
          class="h-100 d-block"
          style="overflow: hidden"
          href="#"
          @click.prevent="!nft.error_code && view"
        >
          <video
            v-if="nft.media_type?.includes('video') && !loadingMedia"
            :src="`${mediaUrl}#t=0.5`"
            poster="\loading.gif"
            muted
            class="img-fluid card-img-top"
            style="object-fit: cover; height: 100%; object-position: center top"
          ></video>
          <img
            v-else-if="nft.media_type?.includes('image') && !loadingMedia"
            v-lazy="mediaUrl"
            style="object-fit: cover; height: 100%; object-position: center top"
            class="img-fluid card-img-top"
            alt="Card
          image cap"
          />
          <img
            v-else-if="loadingMedia"
            :src="'/loading.gif'"
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
    <template #text>
      <div v-if="nft.error_code" class="alert alert-warning">
        <span class="h6 font-weight-bold alert-heading">Missing Data</span
        ><br />
        {{ nft.error_message }}
      </div>
      <div v-if="!nft.error_code">
        <strong class="h5 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
        <hr />
      </div>
      <strong class="h7 font-weight-bold">Issuer </strong><br />
      <span>{{ nft.issuer }}</span
      ><br />
      <div v-if="nft.author" class="mt-2">
        <strong class="h7 font-weight-bold">Author </strong><br />
        <span class="mr-3">{{ nft.author }} </span>
      </div>
      <div v-if="nft.desc" class="mt-2">
        <strong class="h7 font-weight-bold">Description </strong><br />
        <span>{{ nft.desc }}</span>
      </div>
      <div v-if="nft.tokenTaxon !== undefined" class="mt-2">
        <strong class="h7 font-weight-bold">Token Taxon </strong><br />
        <div v-html="nft.tokenTaxon"></div>
      </div>
      <div v-if="nft.standard" class="mt-2">
        <strong class="h7 font-weight-bold">Standard </strong><br />
        <span>{{ nft.standard }}</span>
      </div>
    </template>
    <template #footer>
      <div>
        <!-- <base-button
          v-if="nft.standard && nft.standard === `XLS-20`"
          class="mr-2"
          @click="goToOffer"
          >Offers
          <span v-if="countOffers">({{ countOffers }})</span></base-button
        > -->
        <base-button class="mr-2" @click="openConfirmDeleteDialog"
          >Delete</base-button
        >
        <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl">
          Inspect</external-link
        >
      </div>
    </template>
  </base-card>
  <base-dialog
    v-model="isConfirmDeleteOpen"
    :cancellable="true"
    title="Delete NFT shared with me"
  >
    <template #body>
      <p>
        Are you sure you want to remove this NFT from your 'Shared with me' list
        ?
      </p>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="deleteShared"
          >Yes, remove it</base-button
        >
        <base-button @click="isConfirmDeleteOpen = false"
          >No, keep it</base-button
        >
      </div>
    </template>
  </base-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getNetworkCodeFromType,
  getNodeTypeFromNetwork,
} from "../utils/getNetworkTypeFromCode";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { getIpfsMedia } from "../services/XrpService";

export default defineComponent({
  components: {
    BaseCard,
    BaseDialog,
    BaseButton,
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const mediaUrl = ref("");
    const loadingMedia = ref(false);
    const isConfirmDeleteOpen = ref(false);

    // const nodetype = computed(() => store.getters["user/getNodeType"]);
    const user = computed(() => store.getters["user/getUser"]);
    const nodetypecode = computed(() => getNetworkCodeFromType(nodetype.value));
    const network = computed(() => store.getters["user/getNetwork"]);
    const nodetype = computed(() => getNodeTypeFromNetwork(network.value));

    const bithomID =
      props.nft.standard && props.nft.standard === "XLS-20"
        ? props.nft.currency
        : props.nft.issuer;

    const bihompUrl = computed(() => getInspectorUrl(network.value, bithomID));
    const countSellOffer =
      props.nft.selloffers && props.nft.selloffers.length
        ? props.nft.selloffers.length
        : 0;
    const countBuyOffer =
      props.nft.buyoffers && props.nft.buyoffers.length
        ? props.nft.buyoffers.length
        : 0;

    const countOffers = countSellOffer + countBuyOffer;
    if (props.nft.url) {
      if (
        ["XLS-14", "XLS-16"].includes(props.nft.standard) ||
        (["XLS-20"].includes(props.nft.standard) &&
          props.nft.url.split("//")[0] == "https:")
      ) {
        mediaUrl.value = props.nft.url || "";
      } else {
        loadingMedia.value = true;
        getIpfsMedia(props.nft.url).then((resp: any) => {
          loadingMedia.value = false;
          mediaUrl.value = resp.url;
        });
      }
    }
    // const mediaUrl =
    //   props.nft.url &&
    //   (["XLS-14", "XLS-16"].includes(props.nft.standard) ||
    //     (["XLS-20"].includes(props.nft.standard) &&
    //       props.nft.url.split("//")[0] == "https:"))
    //     ? props.nft.url
    //     : props.nft.url
    //     ? "https://dweb.link/ipfs/" + props.nft.url
    //     : "";
    return {
      mediaUrl,
      loadingMedia,
      bihompUrl,
      countOffers,
      isConfirmDeleteOpen,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        if (props.nft.error_code) {
          router.push({
            path: `/shared/${props.nft.issuer}/${nodetypecode.value}/view/${props.nft.currency}`,
          });
        }
      },
      async goToOffer() {
        await store.commit("nft/setCurrent", props.nft);
        router.push({
          path: `/offers/buy`,
        });
      },
      openConfirmDeleteDialog() {
        isConfirmDeleteOpen.value = true;
      },
      async deleteShared() {
        await store.commit("nft/deleteShared", {
          currency: props.nft.currency,
          nodetype: nodetype.value,
          walletaddress: user.value,
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
