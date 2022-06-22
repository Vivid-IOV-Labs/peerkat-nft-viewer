<template>
  <div>
    <router-link :to="{ path: `/shared` }" class="mb-4 btn btn-link w-100"
      >Back
    </router-link>

    <div v-if="!malformedLink" class="w-100 p-1">
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
                :src="nft.url"
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
          <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl"
            >Inspect</external-link
          >
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
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { fetchOneXls20, fetchXls20 } from "../services/XrpService";

export default defineComponent({
  components: { BaseCard, ExternalLink },
  async setup() {
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
    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, route.params.currency.toString())
    );
    const nft = ref<NFT | null>(null);
    async function fetchOneXls14() {
      try {
        nft.value = await client.value.fetchOne(
          route.params.nftAddress.toString(),
          route.params.currency.toString()
        );
        store.commit("nft/addShared", {
          shared: nft.value,
          nodetype: nodetype.value,
          walletaddress: user.value,
        });
      } catch (error) {
        malformedLink.value = true;
        devlog(error);
      }
    }
    async function fetchShared() {
      try {
        const nftXLS20 = await fetchOneXls20(
          route.params.nftAddress.toString(),
          route.params.currency.toString()
        );
        if (nftXLS20) {
          nft.value = nftXLS20;
          store.commit("nft/addShared", {
            shared: nft.value,
            nodetype: nodetype.value,
            walletaddress: user.value,
          });
        } else {
          throw new Error("Not an XLS20");
        }
      } catch (error) {
        await fetchOneXls14();
      }
    }
    if (nodetypefromlink == nodetype.value) {
      await fetchShared();
    } else {
      malformedLink.value = true;
    }

    return {
      nft,
      nodetype,
      nodetypefromlink,
      bihompUrl,
      malformedLink,
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
