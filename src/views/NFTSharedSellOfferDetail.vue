<template>
  <div>
    <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link w-100">
      Back
    </router-link>
    <h2 class="text-center">Shared Sell Offer</h2>
    <div class="w-80 p-1">
      <base-card v-if="nft && !nodetypefromlink">
        <template #picture>
          <figure style="overflow: hidden">
            <a href="#" @click.prevent="view">
              <video
                v-if="nft.media_type?.includes('video')"
                :src="`${nft.url}#t=0.5`"
                muted
                poster="\loading.gif"
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

        <template #text>
          <strong class="h5 font-weight-bold">Token Name </strong><br />
          {{ nft.tokenName }}
          <hr />
          <div v-if="nft.author" class="mt-2">
            <strong class="h7 font-weight-bold">Author </strong><br />
            <span class="mr-3">{{ nft.author }} </span>
          </div>
          <div v-if="nft.desc" class="mt-2">
            <strong class="h7 font-weight-bold">Description </strong><br />
            <span>{{ nft.desc }}</span>
          </div>
          <div v-if="nft.currency" class="mt-2">
            <strong class="h7 font-weight-bold">Tokent ID </strong><br />
            <span>{{ nft.currency }}</span>
          </div>
          <div v-if="offer.nft_offer_index" class="mt-2">
            <strong class="h7 font-weight-bold">Offer ID </strong><br />
            <span>{{ offer.nft_offer_index }}</span>
          </div>
          <div v-if="offer.amount" class="mt-2">
            <strong class="h7 font-weight-bold">Amount </strong><br />
            <span>{{ Number(offer.amount) / 1000000 }} XRP</span>
          </div>
        </template>
        <template #footer>
          <async-button :on-click="accept"> Accept </async-button>

          <external-link v-if="bihompUrl" class="ml-2" :url="bihompUrl">
            Inspect
          </external-link>
        </template>
      </base-card>
      <div v-if="!nft" class="p-2">
        <div v-if="nodetypefromlink && nodetypefromlink !== nodetype">
          <div v-if="isCustomNode(nodetypefromlink)">
            <h5 class="text-center mt-2">
              It appears that this link to an NFT is for the
              {{ nodetypefromlink }}. Please switch to the
              {{ nodetypefromlink }} in your Xumm app.
            </h5>
            <ul class="mt-2 p-2">
              <li class="pb-2">
                You can switch to the
                {{ nodetypefromlink }} in the Xumm app by clicking “Quit xApp”
              </li>
              <li class="pb-2">
                In the Xumm app: click “Settings”, then “Advanced”, then “Node”
                and select the “
                {{ getNetworkFromNodeType(nodetypefromlink) }}“ node, under the
                CUSTOM section.
              </li>
              <li class="pb-2">
                If you do not see this node under the CUSTOM section; please
                contact the administrator of the network you are trying to
                connect to, for more information.
              </li>
              <li class="pb-2">
                Return to Xumm home, open the Peerkat xApp to view the NFT in
                {{ nodetypefromlink }}
              </li>
            </ul>
          </div>
          <div v-if="!isCustomNode(nodetypefromlink)">
            <h5 class="text-center mt-2">
              It appears that this link to an NFT is for the
              {{ nodetypefromlink }}. Please switch to the
              {{ nodetypefromlink }} in your Xumm app.
            </h5>
            <ul class="mt-2 p-2">
              <li class="pb-2">
                You can switch to the
                {{ nodetypefromlink }} in the Xumm app by clicking “Quit xApp”
              </li>
              <li class="pb-2">
                In the Xumm app: click “Settings”, then “Advanced”, then “Node”
                and select a Node listed in the “{{ nodetypefromlink }}” section
              </li>
              <li class="pb-2">
                Return to Xumm home, open the Peerkat xApp to view the NFT in
                {{ nodetypefromlink }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="!nodetypefromlink">
          <h5 class="text-center mt-2">
            Peerkat is not able to find an NFT from the link that you have
            followed.
          </h5>
          <ul class="mt-2 p-2">
            <li class="pb-2">There could be an error in the link</li>
            <li class="pb-2">
              The owner of the NFT may have changed or the link may be out to
              date.
            </li>
            <li class="pb-2">
              Please check with the NFT owner to ensure that you have followed
              the correct link. If the owner of the NFT has changed recently,
              you will not be able to use the same share link to access the NFT.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BaseCard from "../components/BaseCard.vue";
import AsyncButton from "../components/AsyncButton.vue";
import {
  getNetworkCodeFromType,
  getNetworkTypeFromCode,
  isCustomNode,
  getNetworkFromNodeType,
} from "../utils/getNetworkTypeFromCode";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import {
  acceptOffer,
  fetchSellOffers,
  fetchXls20,
  getOneXls,
} from "../services/XrpService";

import { isInXumm } from "../utils/isInXumm";
import { devlog } from "../utils/devlog";
import XummSdk from "../services/XummService";
export default defineComponent({
  components: { BaseCard, ExternalLink, AsyncButton },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const nodetypefromlink = getNetworkTypeFromCode(
      parseInt(route.params.nodetype as string)
    );
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const user = computed(() => store.getters["user/getUser"]);
    const walletaddress = computed(() => store.getters["user/getAddress"]);

    const malformedLink = ref(false);
    const network = computed(() => store.getters["user/getNetwork"]);

    const offerId = route.params.offerId.toString();
    const nftId = route.params.nftId.toString();
    const owner = route.params.owner.toString();

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, route.params.nftId.toString())
    );
    const nft = ref<any | null>(null);
    const offer = ref<any | null>(null);
    const sellOffers = await fetchSellOffers(nftId);
    const account_nfts = await fetchXls20(owner);
    const currentNft = account_nfts.find((n: any) => n.NFTokenID == nftId);
    const { URI, Issuer, NFTokenID } = currentNft;

    try {
      nft.value = await getOneXls({ URI, Issuer, NFTokenID });
      devlog("nft", nft);
      const { offers } = sellOffers;
      devlog("sellOffers", sellOffers);
      devlog("offers", offers);

      if (offers) {
        offer.value = offers.find((o: any) => o.nft_offer_index === offerId);
      }
      if (offer.value && nft.value) {
        // store.commit("nft/addSharedSellOffers", {
        //   selloffer: { nft: nft.value, offer: offer.value },
        //   walletaddress: walletAddress.value,
        // });
        devlog("addShared", offer.value);

        store.commit("nft/addShared", {
          shared: nft.value,
          nodetype: nodetype.value,
          walletaddress: route.params.owner.toString(),
          user: user.value,
          offer: offer.value,
        });
      }
    } catch (error) {
      devlog("get nft error", error);
    }

    return {
      nft,
      offer,
      nodetype,
      network,
      nodetypefromlink,
      isCustomNode,
      getNetworkFromNodeType,
      bihompUrl,
      malformedLink,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      async accept() {
        if (isInXumm()) {
          const { created } = await XummSdk.acceptOffer(
            {
              Account: walletaddress.value,
              OfferID: offerId,
              User: user.value,
            },
            async () => {
              await store.commit("nft/deleteShared", {
                currency: nft.value.currency,
                nodetype: nodetype.value,
                walletaddress: user.value,
              });
              await store.commit("nft/deleteCurrent");
              await store.commit("nft/setAllXls20", []);
              await store.commit("nft/setAll", []);
              await store.commit("nft/setLines", []);
              router.push({
                path: `/wallet?refresh="true"`,
                replace: true,
              });
            }
          );
          const { uuid } = created;
          XummSdk.openSignRequest(uuid);
        } else {
          await acceptOffer({
            OfferID: offerId,
          });
          router.push({
            path: `/wallet`,
          });
        }
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
