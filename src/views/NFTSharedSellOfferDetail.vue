<template>
  <div>
    <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link w-100">
      Back
    </router-link>
    <h2 class="text-center">Sell Offer</h2>
    <div v-if="!malformedLink" class="w-80 p-1">
      <base-card v-if="nft">
        <template #picture>
          <figure style="overflow: hidden">
            <a href="#" @click.prevent="view">
              <video
                v-if="nft.media_type?.includes('video')"
                :src="`${nft.url}#t=0.5`"
                muted
                class="img-fluid card-img"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
              />
              <img
                v-else-if="nft.media_type?.includes('image')"
                v-lazy="nft.url"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
                class="img-fluid card-img"
                alt="Card
          image cap"
              />
              <img
                v-else
                :src="'/thumbnail.jpg'"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
                class="img-fluid card-img"
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
          <span>{{ nft.issuer }}</span>
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
          <async-button :on-click="accept"> Accept </async-button>

          <external-link v-if="bihompUrl" class="ml-2" :url="bihompUrl">
            Inspect
          </external-link>
        </template>
      </base-card>
      <div v-else class="p-2">
        <h5 class="text-center mt-2">
          It appears that this link to an NFT is for the {{ nodetypefromlink }}.
          Please switch to the {{ nodetypefromlink }} in your Xumm app.
        </h5>
        <ul class="mt-2 p-2">
          <li class="pb-2">
            You can switch to the
            {{ nodetypefromlink }} in the Xumm app by clicking “Quit xApp”
          </li>
          <li class="pb-2">
            In the Xumm app: click “Settings”, then “Advanced”, then “Node” and
            select a Node listed in the “{{ nodetypefromlink }}” section
          </li>
          <li class="pb-2">
            Return to Xumm home, open the Peerkat xApp to view the NFT in
            {{ nodetypefromlink }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="malformedLink" style="margin-top: 13%">
      <h5 class="text-center mt-2">
        Peerkat is not able to find an NFT from the link that you have followed
      </h5>
      <ul class="mt-2 p-2">
        <li class="pb-2">
          To view another user’s XRPL-issued NFT please ensure that you have
          followed the correct link shared by the NFT owner
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
debugger;
import { computed, defineComponent, ref } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BaseCard from "../components/BaseCard.vue";
import AsyncButton from "../components/AsyncButton.vue";
import {
  getNetworkCodeFromType,
  getNetworkTypeFromCode,
} from "../utils/getNetworkTypeFromCode";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import {
  acceptOffer,
  fetchSellOffers,
  fetchXls20,
  getOneXls,
} from "../services/XrpService";
debugger;
export default defineComponent({
  components: { BaseCard, ExternalLink, AsyncButton },
  async setup() {
    debugger;
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const nodetypefromlink = getNetworkTypeFromCode(
      parseInt(route.params.nodetype as string)
    );
    const client = computed(() => store.getters["nft/getXrpClient"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const user = computed(() => store.getters["user/getUser"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const malformedLink = ref(false);
    const network = computed(() => store.getters["user/getNetwork"]);

    const offerId = route.params.offerId.toString();
    const nftId = route.params.nftId.toString();
    const owner = route.params.owner.toString();

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, route.params.offerId.toString())
    );
    const nft = ref<any | null>(null);
    const offer = ref<any | null>(null);
    const sellOffers = await fetchSellOffers(nftId);
    const account_nfts = await fetchXls20(owner);
    const currentNft = account_nfts.find((n: any) => n.NFTokenID == nftId);
    const { URI, Issuer, NFTokenID } = currentNft;
    nft.value = await getOneXls({ URI, Issuer, NFTokenID });
    const { offers } = sellOffers;
    if (offers) {
      offer.value = offers.find((o: any) => o.nft_offer_index === offerId);
    }
    return {
      nft,
      offer,
      nodetype,
      nodetypefromlink,
      bihompUrl,
      malformedLink,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      async accept() {
        await acceptOffer({ OfferID: offerId });
      },
      view() {
        if (nft.value) {
          router.push({
            path: `/shared/${nft.value.issuer}/${getNetworkCodeFromType(
              nodetype.value
            )}/view`,
          });
        }
      },
    };
  },
});
</script>
<style>
.smooth-enter-active,
.smooth-leave-active {
  transition: 0.5s;
}
.smooth-enter,
.smooth-leave-to {
  height: 0;
  opacity: 0;
}
</style>
