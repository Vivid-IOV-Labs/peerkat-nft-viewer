<template>
  <base-card-page>
    <template #title>
      <h1>Details</h1>
    </template>
    <template #picture>
      <video
        :src="url"
        autoplay
        muted
        loop
        playsinlineclass="w-100 card-img"
      ></video>
      <video
        src="https://ipfs.io/ipfs/QmRwgRmzyxDAvrxUDttCJJam92Qq3tP1X9xqxdsV7noKKm"
        autoplay
        loop
        muted
        class="w-100 card-img"
      ></video>
      <!-- 
      <figure>
        <img
        src="https://codingyaar.com/wp-content/uploads/video-in-bootstrap-card.mp4"

          class="card-img"
          :src="nft.url"
          alt="Card image cap"
          @error="fallbackImg"
        />
      </figure> -->
    </template>
    <template #text style="flex: 1">
      <div class="pt-4">
        <ul class="list-group">
          <li class="list-group-item">
            <h5>Token Name</h5>
            {{ nft.currency }}
          </li>
          <li class="list-group-item">
            <h5>Issuer</h5>
            {{ nft.issuer }}
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <base-button class="mr-2" @click="createTrustline">Trustline</base-button>
      <external-link
        :url="`https://test.bithomp.com/explorer/${$route.params.nftAddress}`"
        >External link</external-link
      >
      <base-button class="mr-2" @click="share">Share</base-button>
    </template>
  </base-card-page>
  <div class="row mt-4">
    <div class="col-sm-12 col-xs-12 accordion">
      <div class="card">
        <div class="card-header">
          <h1 class="mb-0">
            <button
              class="btn btn-link btn-block text-left"
              type="button"
              @click.prevent="toggleAction"
            >
              Actions
            </button>
          </h1>
        </div>
        <transition name="smooth">
          <div :class="{ show: showActions }" class="collapse fade">
            <div class="card-body">
              <div class="card-text">
                <ul class="list-group">
                  <li class="list-group-item d-flex">
                    <h5>update</h5>
                    <base-button class="mr-2">Return</base-button>
                  </li>
                  <li class="list-group-item d-flex">
                    <h5>return</h5>
                    <base-button class="mr-2">Return</base-button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCardPage from "@/components/BaseCardPage.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
import type { XummTypes } from "xumm-sdk";
import { createPaylod } from "../services/XummService";
import { fetchOne } from "../services/XrpService";
import ExternalLink from "../components/ExternalLink.vue";
import { openSignRequest } from "../utils/XummActions";

export default defineComponent({
  components: { BaseButton, BaseCardPage, ExternalLink },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const showActions = ref(false);
    console.log(route.params.nftAddress);

    // const nft = await store.getters["nft/getByAddress"](
    //   route.params.nftAddress as string
    // );
    const nft = await fetchOne(
      route.params.nftAddress.toString(),
      route.params.currency.toString()
    );

    return {
      nft,
      url: `https://ipfs.io/ipfs/${nft.cid}`,
      showActions,
      toggleAction() {
        showActions.value = !showActions.value;
      },
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      async createTrustline() {
        const {
          value: { user },
        } = computed(() => store.getters["xumm/getOttData"]);
        const newPayload: XummTypes.CreatePayload = {
          user_token: user,
          txjson: {
            TransactionType: "TrustSet",
            Flags: 131072,
            LimitAmount: {
              currency: nft.currency,
              issuer: nft.issuer,
              value: "1000000000000000e-96",
            },
          },
        };
        try {
          const { uuid } = await createPaylod(newPayload);
          openSignRequest(uuid);
        } catch (error) {
          console.log("error", error);
        }
      },
      share() {
        copyText(window.location.toString());
      },
      inspect() {
        copyText(window.location.toString());
      },
      pages: [
        { label: "VIEW", value: "view" },
        { label: "LIST", value: "list" },
      ],
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
