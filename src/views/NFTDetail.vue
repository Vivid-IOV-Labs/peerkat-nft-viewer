<template>
  <div class="pb-4">
    <router-link :to="{ path: `/` }" class="my-4 btn btn-link"
      >Back
    </router-link>
    <base-card-page class="mb-4">
      <template #picture>
        <figure class="w-100 p4">
          <img
            v-if="nft.media_type?.includes('image')"
            class="card-img"
            :src="nft.url"
            alt="Card image cap"
            @error="fallbackImg"
          />
        </figure>
        <video
          v-if="nft.media_type?.includes('video')"
          :src="nft.url"
          autoplay
          muted
          loop
          playsinline
          class="w-100 card-img"
        ></video>
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
        <external-link
          :url="`https://test.bithomp.com/explorer/${$route.params.nftAddress}`"
          >External link</external-link
        >
        <base-button class="mr-2" @click="share">Share</base-button>
      </template>
    </base-card-page>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject } from "vue";
import ExternalLink from "@/components/ExternalLink.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCardPage from "@/components/BaseCardPage.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
import type { XummTypes } from "xumm-sdk";
import { fetchOne } from "../services/XrpService";
import { openSignRequest } from "../utils/XummActions";

export default defineComponent({
  components: { BaseButton, BaseCardPage, ExternalLink },
  async setup() {
    debugger;
    const route = useRoute();
    const store = useStore();
    const showActions = ref(false);
    debugger;
    // const nft = await store.getters["nft/getByAddress"](
    //   route.params.nftAddress as string
    // );

    ///https://xumm.app/detect/xapp:peerkat.sandbox
    const nft = await fetchOne(
      route.params.nftAddress.toString(),
      route.params.currency.toString()
    );
    debugger;
    return {
      nft,
      showActions,
      toggleAction() {
        showActions.value = !showActions.value;
      },
      isInXumm: inject("isInXumm"),
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      // async createTrustline() {
      //   const {
      //     value: { user },
      //   } = computed(() => store.getters["xumm/getOttData"]);
      //   const newPayload: XummTypes.CreatePayload = {
      //     user_token: user,
      //     txjson: {
      //       TransactionType: "TrustSet",
      //       Flags: 131072,
      //       LimitAmount: {
      //         currency: nft.currency,
      //         issuer: nft.issuer,
      //         value: "1000000000000000e-96",
      //       },
      //     },
      //   };
      //   try {
      //     const { uuid } = await createPaylod(newPayload);
      //     openSignRequest(uuid);
      //   } catch (error) {
      //     console.log("error", error);
      //   }
      // },
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
