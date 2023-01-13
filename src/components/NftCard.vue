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
          <load-media :nft="nft"></load-media>
        </a>
      </figure>
    </template>

    <template #text>
      <div v-if="nft.error_code" class="alert alert-warning">
        <span class="h6 font-weight-bold alert-heading">
          {{ nft.error_title }}</span
        ><br />
        {{ nft.error_message }}
      </div>
      <div v-if="!nft.error_code && nft.tokenName">
        <strong class="h5 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
        <hr />
      </div>
      <div>
        <strong class="h7 font-weight-bold">Issuer </strong><br />
        <span>{{ nft.issuer }}</span
        ><br />
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
        <div
          v-if="
            nft.collection && (nft.collection.family || nft.collection.name)
          "
          class="mt-2"
        >
          <strong class="h7 font-weight-bold">Collection </strong><br />
          <div
            class="
              d-flex
              flex-column
              justify-content-between
              align-items-center
              py-2
            "
          >
            <div
              v-if="nft.collection.family"
              class="
                rounded
                tex-center
                d-flex
                flex-column
                justify-content-between
                align-items-center
                border
                my-2
                w-100
                py-1
                bg-gradient-primary
                border-primary
              "
              style=""
            >
              <strong class="text-uppercase text-primary small font-weight-bold"
                >Family</strong
              >{{ nft.collection.family }}
            </div>
            <div
              v-if="nft.collection.name"
              class="
                rounded
                tex-center
                d-flex
                flex-column
                justify-content-between
                align-items-center
                border
                my-2
                w-100
                py-1
                bg-gradient-primary
                border-primary
              "
              style=""
            >
              <strong class="text-uppercase text-primary small font-weight-bold"
                >Name</strong
              >{{ nft.collection.name }}
            </div>
          </div>
        </div>
        <div v-if="nft.author" class="mt-2">
          <strong class="h7 font-weight-bold">Author </strong><br />
          <span class="mr-3">{{ nft.author }} </span>
        </div>
        <div v-if="nft.desc" class="mt-2">
          <strong class="h7 font-weight-bold">Description </strong><br />
          <div v-html="nft.desc"></div>
        </div>
        <div v-if="nft.attributes && nft.attributes.length" class="mt-2">
          <strong class="h7 font-weight-bold">Attributes </strong><br />
          <div
            class="
              d-flex
              flex-column
              justify-content-between
              align-items-center
              py-2
            "
          >
            <div
              v-for="(a, index) in nft.attributes"
              :key="index"
              class="
                rounded
                tex-center
                d-flex
                flex-column
                justify-content-between
                align-items-center
                border
                my-2
                w-100
                py-1
                bg-gradient-primary
                border-primary
              "
              style=""
            >
              <strong
                class="text-uppercase text-primary small font-weight-bold"
                >{{ a.trait_type }}</strong
              >{{ a.value }}
            </div>
          </div>
        </div>
        <!-- <div v-if="nft.tokenTaxon !== undefined" class="mt-2">
          <strong class="h7 font-weight-bold">Token Taxon </strong><br />
          <span class="mr-3">{{ nft.tokenTaxon }} </span>
        </div>
        <div v-if="nft.nft_serial" class="mt-2">
          <strong class="h7 font-weight-bold">Serial </strong><br />
          <span>{{ nft.nft_serial }}</span>
        </div> -->
        <div v-if="nft.standard" class="mt-2">
          <strong class="h7 font-weight-bold">Standard </strong><br />
          <span>{{ nft.standard }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <div>
        <base-button
          v-if="nft.standard == 'XLS-20'"
          class="mr-2"
          @click="goToOffer"
          >Offers
          <span v-if="countOffers">({{ countOffers }})</span></base-button
        >
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
import LoadMedia from "@/components/LoadMedia.vue";
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

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    ExternalLink,
    LoadMedia,
  },
  props: {
    nft: { type: Object, required: true },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

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

    return {
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
        if (!props.nft.error_code) {
          router.push({
            path: `/wallet/${props.nft.issuer}/view/${props.nft.currency}`,
          });
        }
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
