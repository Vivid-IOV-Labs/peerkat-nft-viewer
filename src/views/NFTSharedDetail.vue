<template>
  <div>
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
              <load-media :nft="nft" :shared="true"></load-media>
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
            <strong class="font-weight-bold">Token Name </strong><br />
            {{ nft.tokenName }}
            <hr />
          </div>
          <strong class="font-weight-bold">Issuer </strong><br />
          <span>{{ nft.issuer }}</span>
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
                class="rounded text-break word-break-all text-center d-flex flex-column justify-content-between align-items-center border py-2 px-4 my-2 w-100 py-1 bg-gradient-primary border-primary"
                style=""
              >
                <strong
                  class="text-uppercase text-primary small font-weight-bold"
                  >Family</strong
                >{{ nft.collection.family }}
              </div>
              <div
                v-if="nft.collection.name"
                class="rounded text-break word-break-all text-center d-flex flex-column justify-content-between align-items-center border py-2 px-4 my-2 w-100 py-1 bg-gradient-primary border-primary"
                style=""
              >
                <strong
                  class="text-uppercase text-primary small font-weight-bold"
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
                class="rounded text-break word-break-all text-center d-flex flex-column justify-content-between align-items-center border py-2 px-4 my-2 w-100 py-1 bg-gradient-primary border-primary"
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
          <external-link
            v-if="bihompUrl"
            class="mr-2 btn btn-primary btn-sm"
            :url="bihompUrl"
            >Inspect</external-link
          >
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
import {
  getNetworkCodeFromType,
  getNetworkTypeFromCode,
  getNetworkFromNodeType,
  isCustomNode,
  getNodeTypeFromNetwork,
} from "../utils/getNetworkTypeFromCode";
import { devlog } from "../utils/devlog";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { fetchOneXls20, getIpfsMedia } from "../services/XrpService";
import LoadMedia from "@/components/LoadMedia.vue";

export default defineComponent({
  components: { BaseCard, ExternalLink, LoadMedia },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const nodetypefromlink = getNetworkTypeFromCode(
      parseInt(route.params.nodetype as string)
    );
    const client = computed(() => store.getters["nft/getXrpClient"]);
    const user = computed(() => store.getters["user/getUser"]);

    const malformedLink = ref(false);
    const network = computed(() => store.getters["user/getNetwork"]);
    const nodetype = computed(() => getNodeTypeFromNetwork(network.value));
    const networkCodeFromType = computed(() =>
      getNetworkCodeFromType(nodetype.value)
    );
    const nft = ref<any | null>(null);
    const bithomID = computed(() =>
      nft.value.standard && nft.value.standard === "XLS-20"
        ? nft.value.currency
        : nft.value.issuer
    );
    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, bithomID.value)
    );
    async function fetchOneXls14() {
      try {
        nft.value = await client.value.fetchOne(
          route.params.nftAddress.toString(),
          route.params.currency.toString()
        );
        store.commit("nft/addShared", {
          shared: nft.value,
          nodetype: nodetype.value,
          walletaddress: route.params.nftAddress.toString(),
          user: user.value,
        });
      } catch (error) {
        // malformedLink.value = true;
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
          await fetchMedia();
          store.commit("nft/addShared", {
            shared: nft.value,
            nodetype: nodetype.value,
            walletaddress: route.params.nftAddress.toString(),
            user: user.value,
          });
        } else {
          throw new Error("Not an XLS-20");
        }
      } catch (error) {
        devlog(error);
        await fetchOneXls14();
      }
    }
    async function fetchMedia() {
      if (["XLS-14", "XLS-16"].includes(nft.value.standard)) {
        nft.value.mediaUrl = nft.value.url || "";
        nft.value.thumbnailUrl = nft.value.thumbnail || "";
      } else {
        const ext =
          nft.value.media_type && nft.value.media_type.split("/").pop()
            ? nft.value.media_type.split("/").pop()
            : nft.value.thumbnail
            ? nft.value.thumbnail.split(".").pop()
            : "jpg";
        const extnojpg = ext.replace("jpg", "jpeg");
        const url = nft.value.type?.includes("video")
          ? `/apidev/assets/videos/${nft.value.currency}/video.${extnojpg}`
          : nft.value.type?.includes("animation")
          ? `/apidev/assets/animations/${nft.value.currency}/animation.${extnojpg}`
          : `/apidev/assets/images/${nft.value.currency}/full/image.${extnojpg}`;
        // thumbnailUrl.value = `/apidev/assets/images/${nft.value.currency}/200px/image.${ext}`;
        const isReturned = await fetch(url, {
          method: "HEAD",
        });

        if (isReturned.ok && isReturned.status === 200) {
          nft.value.mediaUrl = url;
        } else if (nft.value.url) {
          const resp = await getIpfsMedia(nft.value.url);
          nft.value.mediaUrl = resp.url;
        }
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
      network,
      nodetypefromlink,
      bihompUrl,
      malformedLink,
      isCustomNode,
      getNetworkFromNodeType,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        if (nft.value && !nft.value.error_code) {
          router.push({
            path: `/shared/${nft.value.issuer}/${networkCodeFromType.value}/view/${nft.value.currency}`,
          });
        }
      },
    };
  },
});
</script>
