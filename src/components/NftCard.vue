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
      <div>
        <strong class="h7 font-weight-bold">Issuer </strong><br />
        <span>{{ nft.issuer }}</span
        ><br />
        {{ mediaUrl }}
      </div>
      <div>
        <div v-if="nft.balanceFormatted || nft.limitFormatted" class="mt-2">
          <strong v-if="nft.balanceFormatted" class="h7 font-weight-bold"
            >Balance
          </strong>
          <span v-if="nft.balanceFormatted" class="mr-3"
            >{{ nft.balanceFormatted }}
          </span>
          <strong v-if="nft.limitFormatted" class="h7 font-weight-bold"
            >Total Supply
          </strong>
          <span v-if="nft.limitFormatted">{{ nft.limitFormatted }}</span>
        </div>
        <div v-if="nft.author" class="mt-2">
          <strong class="h7 font-weight-bold">Author </strong><br />
          <span class="mr-3">{{ nft.author }} </span>
        </div>
        <div v-if="nft.desc" class="mt-2">
          <strong class="h7 font-weight-bold">Description </strong><br />
          <div v-html="nft.desc"></div>
        </div>
        <div v-if="nft.tokenTaxon !== undefined" class="mt-2">
          <strong class="h7 font-weight-bold">Token Taxon </strong><br />
          <div v-html="nft.tokenTaxon"></div>
        </div>
        <div v-if="nft.standard" class="mt-2">
          <strong class="h7 font-weight-bold">Standard </strong><br />
          <span>{{ nft.standard }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <div>
        <!-- <base-button
          v-if="nft.standard == 'XLS-20'"
          class="mr-2"
          @click="goToOffer"
          >Offers
          <span v-if="countOffers">({{ countOffers }})</span></base-button
        > -->
        <base-button class="mr-2" @click="share">Share</base-button>
        <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl">
          Inspect</external-link
        >
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { copyText } from "../utils/copytext";
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
    BaseButton,
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const mediaUrl = ref("");
    const loadingMedia = ref(false);
    const network = computed(() => store.getters["user/getNetwork"]);
    const nodetype = computed(() => getNodeTypeFromNetwork(network.value));

    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const bithomID =
      props.nft.standard && props.nft.standard === "XLS-20"
        ? props.nft.currency
        : props.nft.issuer;

    const bihompUrl = computed(() => getInspectorUrl(network.value, bithomID));

    const passNFTIssuerOrXUMMowner =
      props.nft.standard && props.nft.standard === "XLS-20"
        ? props.nft.owner || walletAddress.value
        : props.nft.issuer;

    function shareUrl(nodetypecode: number | undefined) {
      const xummSandbox = import.meta.env.VITE_XUMM_DEEPLINK;
      return `${xummSandbox}?redirect=/shared/${passNFTIssuerOrXUMMowner}/${nodetypecode}/${props.nft.currency}`;
    }

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
        //loadingMedia.value = true;
        // getIpfsMedia(props.nft.url).then((resp: any) => {
        //   loadingMedia.value = false;
        //   mediaUrl.value = resp.url;
        // });
        //mediaUrl.value = "https://cloudflare-ipfs.com/ipfs/" + props.nft.url;
        mediaUrl.value = "https://peerkat.mypinata.cloud/ipfs/" + props.nft.url;
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
    return {
      mediaUrl,
      loadingMedia,
      async goToOffer() {
        await store.commit("nft/setCurrent", props.nft);
        router.push({
          path: `/offers/sell`,
        });
      },
      bihompUrl,
      countOffers,
      share() {
        const nodetypecode = getNetworkCodeFromType(nodetype.value);

        const params = {
          title: "Share NFT link",
          text: "Copied to clipboard",
        };

        const url = shareUrl(nodetypecode);
        copyText(url, params);
      },
      view() {
        router.push({
          path: `/wallet/${props.nft.issuer}/view/${props.nft.currency}`,
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
