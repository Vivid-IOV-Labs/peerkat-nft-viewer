<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Detail page</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNavAltMarkup" class="collapse navbar-collapse">
      <div class="navbar-nav">
        <a class="nav-item nav-link" href="#">View</a>

        <a class="nav-item nav-link active" href="#"
          >View <span class="sr-only">(current)</span></a
        >
      </div>
    </div>
  </nav>
  <base-card-page>
    <template #title>
      <h1>Details</h1>
    </template>
    <template #picture>
      <video
        src="https://codingyaar.com/wp-content/uploads/video-in-bootstrap-card.mp4"
        autoplay
        loop
        muted
        class="w-100 card-img"
      ></video>
      <!-- 
      <figure>
        <img
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
import BaseSelect from "@/components/BaseSelect.vue";
import ExternalLink from "../components/ExternalLink.vue";
import { openSignRequest } from "../utils/XummActions";

export default defineComponent({
  components: { BaseButton, BaseCardPage, BaseSelect, ExternalLink },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const trustLinePayload = ref(null);
    const signLink = ref<string | undefined>(undefined);
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
      trustLinePayload,
      signLink,
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
