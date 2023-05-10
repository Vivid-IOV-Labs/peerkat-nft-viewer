<template>
  <div>
    <router-link :to="{ path: `/wallet` }" class="mb-4 btn btn-link w-100"
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
              <load-media-preview
                v-if="nft.standard == 'XLS-20'"
                :nft="nft"
              ></load-media-preview>
              <load-media v-else :nft="nft"></load-media>
              <!-- <load-media :nft="nft" :shared="true"></load-media> -->
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
          <div v-if="nft.assets" class="d-flex justify-content-end mb-2">
            <span
              v-if="
            Object.values(nft.assets)
              .filter((a) => a)
              .some((a:any) => a.media_type && a.media_type.includes('video'))
          "
              class="d-flex justify-content-center align-items-center p-1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="15"
                  height="15"
                  transform="matrix(1 0 0 -1 6 19)"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 0C0.895431 0 0 0.89543 0 2V22C0 23.1046 0.89543 24 2 24H22C23.1046 24 24 23.1046 24 22V2C24 0.895431 23.1046 0 22 0H2ZM10.545 6.00424C9.87973 5.57183 9 6.04925 9 6.84269V16.1573C9 16.9508 9.87974 17.4282 10.545 16.9958L17.7101 12.3384C18.3168 11.9441 18.3168 11.0559 17.7101 10.6616L10.545 6.00424Z"
                  fill="#3052FF"
                />
              </svg>
            </span>
            <span
              v-if="
            Object.values(nft.assets)
              .filter((a) => a)
              .some((a:any) => a.media_type && a.media_type.includes('gif'))
          "
              class="d-flex justify-content-center align-items-center p-1 ml-1"
            >
              <svg
                width="29"
                height="24"
                viewBox="0 0 29 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="26"
                  height="15"
                  transform="matrix(1 0 0 -1 1 19)"
                  fill="white"
                />
                <path
                  d="M26.1818 0H2.18182C1.60316 0 1.04821 0.229869 0.63904 0.63904C0.229869 1.04821 0 1.60316 0 2.18182V21.8182C0 22.3968 0.229869 22.9518 0.63904 23.361C1.04821 23.7701 1.60316 24 2.18182 24H26.1818C26.7605 24 27.3154 23.7701 27.7246 23.361C28.1338 22.9518 28.3636 22.3968 28.3636 21.8182V2.18182C28.3636 1.60316 28.1338 1.04821 27.7246 0.63904C27.3154 0.229869 26.7605 0 26.1818 0ZM12 14.1818C12 15.3391 11.5403 16.449 10.7219 17.2674C9.90358 18.0857 8.79367 18.5455 7.63636 18.5455C6.47906 18.5455 5.36915 18.0857 4.55081 17.2674C3.73247 16.449 3.27273 15.3391 3.27273 14.1818V9.81818C3.27286 8.93452 3.54128 8.07172 4.04247 7.34393C4.54365 6.61614 5.25399 6.05767 6.0795 5.74239C6.90501 5.42712 7.80679 5.3699 8.66552 5.57831C9.52426 5.78672 10.2995 6.25094 10.8886 6.90955C10.9897 7.01532 11.0684 7.14033 11.1202 7.27715C11.172 7.41397 11.1957 7.55981 11.1899 7.70598C11.1842 7.85216 11.1491 7.99568 11.0868 8.12802C11.0244 8.26036 10.9361 8.37881 10.8271 8.47633C10.718 8.57385 10.5905 8.64844 10.452 8.69566C10.3136 8.74289 10.1671 8.76178 10.0212 8.75123C9.87525 8.74067 9.73296 8.70088 9.60274 8.63421C9.47253 8.56755 9.35705 8.47538 9.26318 8.36318C8.96862 8.03358 8.58089 7.80123 8.15134 7.6969C7.72178 7.59256 7.27067 7.62117 6.85773 7.77892C6.4448 7.93667 6.08952 8.21613 5.83895 8.58029C5.58837 8.94445 5.45432 9.37614 5.45455 9.81818V14.1818C5.45455 14.7605 5.68442 15.3154 6.09359 15.7246C6.50276 16.1338 7.05771 16.3636 7.63636 16.3636C8.21502 16.3636 8.76997 16.1338 9.17914 15.7246C9.58831 15.3154 9.81818 14.7605 9.81818 14.1818V13.0909H8.72727C8.43795 13.0909 8.16047 12.976 7.95588 12.7714C7.7513 12.5668 7.63636 12.2893 7.63636 12C7.63636 11.7107 7.7513 11.4332 7.95588 11.2286C8.16047 11.024 8.43795 10.9091 8.72727 10.9091H10.9091C11.1984 10.9091 11.4759 11.024 11.6805 11.2286C11.8851 11.4332 12 11.7107 12 12V14.1818ZM16.3636 17.4545C16.3636 17.7439 16.2487 18.0214 16.0441 18.2259C15.8395 18.4305 15.5621 18.5455 15.2727 18.5455C14.9834 18.5455 14.7059 18.4305 14.5013 18.2259C14.2968 18.0214 14.1818 17.7439 14.1818 17.4545V6.54545C14.1818 6.25613 14.2968 5.97865 14.5013 5.77407C14.7059 5.56948 14.9834 5.45455 15.2727 5.45455C15.5621 5.45455 15.8395 5.56948 16.0441 5.77407C16.2487 5.97865 16.3636 6.25613 16.3636 6.54545V17.4545ZM24 7.63636H20.7273V10.9091H22.9091C23.1984 10.9091 23.4759 11.024 23.6805 11.2286C23.8851 11.4332 24 11.7107 24 12C24 12.2893 23.8851 12.5668 23.6805 12.7714C23.4759 12.976 23.1984 13.0909 22.9091 13.0909H20.7273V17.4545C20.7273 17.7439 20.6123 18.0214 20.4078 18.2259C20.2032 18.4305 19.9257 18.5455 19.6364 18.5455C19.347 18.5455 19.0696 18.4305 18.865 18.2259C18.6604 18.0214 18.5455 17.7439 18.5455 17.4545V6.54545C18.5455 6.25613 18.6604 5.97865 18.865 5.77407C19.0696 5.56948 19.347 5.45455 19.6364 5.45455H24C24.2893 5.45455 24.5668 5.56948 24.7714 5.77407C24.976 5.97865 25.0909 6.25613 25.0909 6.54545C25.0909 6.83478 24.976 7.11226 24.7714 7.31684C24.5668 7.52143 24.2893 7.63636 24 7.63636Z"
                  fill="#3052FF"
                />
              </svg>
            </span>
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
          <div
            v-if="
              nft.attributes &&
              nft.attributes.filter((a:any) => a.trait_type || a.value).length
                .length
            "
            class="mt-2"
          >
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

          <ul class="nav nav-pills nav-fill my-4">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ 'active  bg-danger': showTab === 'sell' }"
                href="#"
                @click.prevent="showTab = 'sell'"
                >Sell Offers
                <span v-if="nft.selloffers && nft.selloffers.length"
                  >({{ nft.selloffers.length }})</span
                >
                <span v-else>(0)</span>
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ 'active text-white bg-success': showTab === 'buy' }"
                href="#"
                @click.prevent="showTab = 'buy'"
                >Buy Offers
                <span v-if="nft.buyoffers && nft.buyoffers.length"
                  >({{ nft.buyoffers.length }})</span
                >
                <span v-else>(0)</span>
              </a>
            </li>
          </ul>
          <div>
            <div v-if="showTab === 'sell'">
              <div v-if="nft.selloffers.length == 0">
                <p>No current offers found</p>
              </div>
              <div v-else>
                <div
                  v-for="offer in nft.selloffers.sort(
              (a:any, b:any) => b.amount + b.amount
            )"
                  :key="offer.nft_offer_index"
                  class="mt-4"
                >
                  <sell-card
                    v-if="offer"
                    :token="nft.currency"
                    :offer="offer"
                  ></sell-card>
                </div>
              </div>
            </div>
            <div v-if="showTab === 'buy'">
              <div v-if="!nft.buyoffers || nft.buyoffers.length == 0">
                <p>No current offers found</p>
              </div>
              <div v-else>
                <div
                  v-for="offer in nft.buyoffers.sort(
              (a:any, b:any) => b.amount - b.amount
            )"
                  :key="offer.nft_offer_index"
                  class="mt-4"
                >
                  <accept-buy-offer-card
                    v-if="offer"
                    :offer="offer"
                    :nft-id="nft.currency"
                  ></accept-buy-offer-card>
                </div>
              </div>
            </div>
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

      <div v-if="!nft" class="p-2">not found</div>
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
  getNetworkFromNodeType,
  isCustomNode,
  getNodeTypeFromNetwork,
} from "../utils/getNetworkTypeFromCode";
import { devlog } from "../utils/devlog";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { fetchOneXls20, getIpfsMedia } from "../services/XrpService";
import LoadMedia from "@/components/LoadMedia.vue";
import LoadMediaPreview from "@/components/LoadMediaPreview.vue";
import AcceptBuyOfferCard from "@/components/AcceptBuyOfferCard.vue";
import SellCard from "@/components/SellCard.vue";
export default defineComponent({
  components: {
    BaseCard,
    ExternalLink,
    LoadMedia,
    LoadMediaPreview,
    AcceptBuyOfferCard,
    SellCard,
  },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const currenTab = "sell";
    const showTab = ref(currenTab);
    const client = computed(() => store.getters["nft/getXrpClient"]);

    const network = computed(() => store.getters["user/getNetwork"]);
    const user = computed(() => store.getters["user/getUser"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const nodetype = computed(() => getNodeTypeFromNetwork(network.value));

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
          walletAddress.value,
          route.params.nftToken.toString()
        );
      } catch (error) {
        // malformedLink.value = true;
        devlog(error);
      }
    }
    async function fetchShared() {
      try {
        const nftXLS20 = await fetchOneXls20(
          walletAddress.value,
          route.params.nftToken.toString(),
          user.value
        );
        if (nftXLS20) {
          nft.value = nftXLS20;
          await fetchMedia();
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
    await fetchShared();
    return {
      nft,
      nodetype,
      network,
      bihompUrl,
      showTab,
      isCustomNode,
      getNetworkFromNodeType,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        if (nft.value && !nft.value.error_code) {
          router.push({
            path: `/wallet/${nft.value.issuer}/view/${nft.value.currency}`,
          });
        }
      },
    };
  },
});
</script>
