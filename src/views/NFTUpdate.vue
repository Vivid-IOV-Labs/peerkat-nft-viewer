<template>
  <div class="row flex items-center">
    <div class="col-sm-12 col-xs-12 d-flex flex-column pb-3">
      <div class="card">
        <div class="card-body">
          <h1 class="card-title">Details</h1>
          <div class="pt-4 card-text" style="flex: 1">
            <pre>{{ trustLinePayload }}</pre>
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
        </div>

        <div class="card-footer mt-auto d-flex justify-content-end">
          <base-button
            v-if="!signLink"
            size="large"
            class="mr-2"
            @click="createTrustline"
            >Trustline</base-button
          >
          <a v-if="signLink" class="bnt" :href="signLink">sign nft</a>
          <base-button class="mr-2" @click="inspect">View</base-button>
          <base-button class="mr-2" @click="share">Share</base-button>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-xs-12 d-flex flex-column pb-3">
      <div class="card">
        <div class="card-body">
          <h1 class="card-title">Actions</h1>
          <div class="pt-4 card-text" style="flex: 1">
            <pre>{{ trustLinePayload }}</pre>
            <ul class="list-group">
              <li class="list-group-item flex">
                <h5>update</h5>
                <base-button class="mr-2">Return</base-button>
              </li>
              <li class="list-group-item flex">
                <h5>return</h5>
                <base-button class="mr-2">Return</base-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
import type { XummTypes } from "xumm-sdk";
import { createPaylod } from "../services/XummService";

export default defineComponent({
  components: { BaseButton },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const trustLinePayload = ref(null);
    const signLink = ref<string | undefined>(undefined);

    const nft = await store.getters["nft/getByAddress"](
      route.params.nftAddress as string
    );

    return {
      nft,
      trustLinePayload,
      signLink,
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
            // Account: account,
            Flags: 131072,
            LimitAmount: {
              currency: nft.currency,
              issuer: nft.issuer,
              value: "1000000000000000e-96",
            },
          },
        };
        try {
          const {
            next: { always },
          } = await createPaylod(newPayload);
          signLink.value = always as string;
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
    };
  },
});
</script>
