<template>
  <base-card style="height: 70vh">
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
        <span class="h6 font-weight-bold alert-heading">{{
          nft.error_title
        }}</span
        ><br />
        {{ nft.error_message }}
      </div>
      <div v-if="!nft.error_code">
        <strong class="h5 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
      </div>
      <strong class="font-weight-bold">Issuer </strong><br />
      <span>{{ nft.issuer }}</span
      ><br />
      <div
        v-if="nft.collection && (nft.collection.family || nft.collection.name)"
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
        <span>{{ nft.desc }}</span>
      </div>
      <div v-if="nft.attributes && nft.attributes.length" class="mt-2">
        <strong class="font-weight-bold">Attributes </strong><br />
        <div
          class="d-flex flex-column justify-content-between align-items-center py-2"
        >
          <div
            v-for="(a, index) in nft.attributes"
            :key="index"
            class="rounded tex-center d-flex flex-column justify-content-between align-items-center border my-2 w-100 py-1 bg-gradient-primary border-primary"
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
        <div v-html="nft.tokenTaxon"></div>
      </div>
      <div v-if="nft.nft_serial" class="mt-2">
        <strong class=" font-weight-bold">Serial </strong><br />
        <span>{{ nft.nft_serial }}</span>
      </div> -->
      <div v-if="nft.standard" class="mt-2">
        <strong class="font-weight-bold">Standard </strong><br />
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
import LoadMedia from "@/components/LoadMedia.vue";

export default defineComponent({
  components: {
    BaseCard,
    BaseDialog,
    BaseButton,
    ExternalLink,
    LoadMedia,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
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

    return {
      bihompUrl,
      countOffers,
      isConfirmDeleteOpen,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        if (!props.nft.error_code) {
          router.push({
            path: `/shared/${props.nft.issuer}/${nodetypecode.value}/view/${props.nft.currency}`,
          });
        }
      },
      async goToOffer() {
        // await store.commit("nft/setCurrent", props.nft);
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
