<template>
  <base-card>
    <template #picture>
      <figure v-if="nft.url" style="overflow: hidden; height: 100%">
        <a
          class="h-100 d-block"
          style="overflow: hidden"
          href="#"
          @click.prevent="view"
        >
          <load-media-preview
            v-if="nft.standard == 'XLS-20'"
            :nft="nft"
          ></load-media-preview>
          <load-media v-else :nft="nft"></load-media>
          <!-- <load-media :nft="nft"></load-media> -->
        </a>
      </figure>
      <img
        v-else
        :src="'/thumbnail.jpg'"
        style="object-fit: cover; height: 100%; object-position: center center"
        class="img-fluid card-img-top"
        alt="Card
          image cap"
      />
    </template>

    <template #text>
      <div v-if="nft.error_code" class="alert alert-warning">
        <span class="h6 font-weight-bold alert-heading">
          {{ nft.error_title }}</span
        ><br />
        {{ nft.error_message }}
      </div>
      <div v-if="nft.badgetypes" class="d-flex justify-content-end mb-2">
        <span v-if="nft.badgetypes.animation" class="badge badge-primary p-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            class="h-6 w-6"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 368v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H416zM48 240v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H416zM48 112v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H416zM160 128v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32H192z"
            />
          </svg>
        </span>
        <span v-if="nft.badgetypes.video" class="badge badge-primary p-2 ml-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            class="h-6 w-6"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 576 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"
            /></svg
        ></span>
        <div v-if="nft.badgetypes.image" class="badge badge-primary p-2 ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            class="h-6 w-6"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
            />
          </svg>
        </div>
        <div v-if="nft.badgetypes.audio" class="badge badge-primary p-2 ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            class="h-6 w-6"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 640 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
            />
          </svg>
        </div>
        <div v-if="nft.badgetypes.file" class="badge badge-primary p-2 ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            class="h-6 w-6"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 384 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"
            />
          </svg>
        </div>
      </div>

      <div v-if="!nft.error_code && nft.tokenName">
        <strong class="font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
      </div>
      <div>
        <strong class="font-weight-bold">Issuer </strong><br />
        <span>{{ nft.issuer }}</span
        ><br />
      </div>
      <div>
        <div v-if="nft.balanceFormatted || nft.limitFormatted" class="mt-2">
          <strong v-if="nft.balanceFormatted" class="font-weight-bold"
            >Balance
          </strong>
          <span v-if="nft.balanceFormatted" class="mr-3"
            >{{ nft.balanceFormatted }}
          </span>
          <strong v-if="nft.limitFormatted" class="font-weight-bold"
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
          <strong class="font-weight-bold">Collection </strong><br />
          <div
            class="d-flex flex-column justify-content-between align-items-center py-2"
          >
            <div
              v-if="nft.collection.family"
              class="rounded tex-center d-flex flex-column justify-content-between align-items-center border my-2 w-100 py-1 bg-gradient-primary border-primary"
              style=""
            >
              <strong class="text-uppercase text-primary small font-weight-bold"
                >Family</strong
              >{{ nft.collection.family }}
            </div>
            <div
              v-if="nft.collection.name"
              class="rounded tex-center d-flex flex-column justify-content-between align-items-center border my-2 w-100 py-1 bg-gradient-primary border-primary"
              style=""
            >
              <strong class="text-uppercase text-primary small font-weight-bold"
                >Name</strong
              >{{ nft.collection.name }}
            </div>
          </div>
        </div>
        <div v-if="nft.author" class="mt-2">
          <strong class="font-weight-bold">Author </strong><br />
          <span class="mr-3">{{ nft.author }} </span>
        </div>
        <div v-if="nft.desc" class="mt-2">
          <strong class="font-weight-bold">Description </strong><br />
          <div v-html="nft.desc"></div>
        </div>
        <div v-if="nft.attributes && nft.attributes.length" class="mt-2">
          <strong class="font-weight-bold">Attributes </strong><br />
          <div
            class="d-flex flex-column justify-content-between align-items-center py-2"
          >
            <div
              v-for="(a, index) in nft.attributes"
              :key="index"
              class="rounded tex-center d-flex flex-column justify-content-between align-items-center border my-2 w-100 p-2 bg-gradient-primary border-primary"
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
          <strong class=" font-weight-bold">Token Taxon </strong><br />
          <span class="mr-3">{{ nft.tokenTaxon }} </span>
        </div>
        <div v-if="nft.nft_serial" class="mt-2">
          <strong class=" font-weight-bold">Serial </strong><br />
          <span>{{ nft.nft_serial }}</span>
        </div> -->
        <div v-if="nft.standard" class="mt-2">
          <strong class="font-weight-bold">Standard </strong><br />
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
          <span v-if="countOffers">({{ countOffers }})</span>
          <span v-else>(0)</span>
        </base-button>
        <base-button class="mr-2" @click="share">Share</base-button>
        <external-link
          v-if="bihompUrl"
          class="mr-2 btn btn-primary btn-sm"
          :url="bihompUrl"
        >
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
import LoadMediaPreview from "@/components/LoadMediaPreview.vue";
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
    LoadMediaPreview,
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
        //store.commit("nft/setCurrent", props.nft);

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
