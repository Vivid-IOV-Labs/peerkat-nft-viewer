<template>
  <div class="w-100 pt-0 p-1" style="overflow: scroll">
    <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link w-100"
      >Back
    </router-link>

    <div class="w-100 p-1">
      <base-card v-if="nft">
        <template #picture>
          <figure style="overflow: hidden">
            <a
              class="h-100 d-block"
              style="overflow: hidden"
              href="#"
              @click.prevent="view"
            >
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
              ></video>
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
        </template>
        <template #footer>
          <external-link class="mr-2" :url="bihompUrl">Inspect</external-link>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import BaseCard from "../components/BaseCard.vue";
import {
  getNetworkCodeFromType,
  getNetworkTypeFromCode,
} from "../utils/getNetworkTypeFromCode";
import { NFT } from "../models/NFT";
import { devlog } from "../utils/devlog";

export default defineComponent({
  components: { BaseCard, ExternalLink },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const nodetypefromlink = getNetworkTypeFromCode(
      parseInt(route.params.nodetype as string)
    );
    const othernodetype = nodetypefromlink == "TESTNET" ? "MAINNET" : "TESTNET";
    const client = computed(() => store.getters["nft/getXrpClient"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const user = computed(() => store.getters["user/getUser"]);
    const bihompUrl = computed(() =>
      nodetype.value == "TESTNET"
        ? `https://test.bithomp.com/explorer/${route.params.nodetype}`
        : `https://bithomp.com/explorer/${route.params.nodetype}`
    );
    const nft = ref<NFT | null>(null);
    if (nodetypefromlink == nodetype.value) {
      try {
        nft.value = await client.value.fetchOne(
          route.params.nftAddress.toString()
        );
        store.commit("nft/addShared", {
          shared: nft.value,
          nodetype: nodetype.value,
          walletaddress: user.value,
        });
      } catch (error) {
        devlog(error);
      }
    }

    return {
      nft,
      othernodetype,
      nodetype,
      nodetypefromlink,
      bihompUrl,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
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
