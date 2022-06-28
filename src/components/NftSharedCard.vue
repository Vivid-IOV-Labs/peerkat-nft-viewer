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
            :src="nft.url"
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
      <div v-if="nft.author" class="mt-2">
        <strong class="h7 font-weight-bold">Author </strong><br />
        <span class="mr-3">{{ nft.author }} </span>
      </div>
      <div v-if="nft.desc" class="mt-2">
        <strong class="h7 font-weight-bold">Description </strong><br />
        <span>{{ nft.desc }}</span>
      </div>
      <div v-if="nft.standard" class="mt-2">
        <strong class="h7 font-weight-bold">Standard </strong><br />
        <span>{{ nft.standard }}</span>
      </div>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="goToOffer"
          >Offers
          <span v-if="countOffers">({{ countOffers }})</span></base-button
        >
        <base-button class="mr-2" @click="deleteShared">Delete</base-button>
        <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl">
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
import { getInspectorUrl } from "../utils/getInspectorUrl";

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
    const user = computed(() => store.getters["user/getUser"]);
    const nodetypecode = computed(() => getNetworkCodeFromType(nodetype.value));
    const network = computed(() => store.getters["user/getNetwork"]);
    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.nft.currency)
    );
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
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        router.push({
          path: `/shared/${props.nft.issuer}/${nodetypecode.value}/view/${props.nft.currency}`,
        });
      },
      async goToOffer() {
        await store.commit("nft/setCurrent", props.nft);
        router.push({
          path: `/offers/buy`,
        });
      },
      deleteShared() {
        store.commit("nft/deleteShared", {
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
