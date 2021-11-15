<template>
  <div class="row flex items-center">
    <div class="col-sm-4 col-offset-1 col-xs-12 px-4">
      <div class="">
        <figure>
          <img
            class="card-img-top"
            :src="nft.url"
            alt="Card image cap"
            @error="fallbackImg"
          />
        </figure>
      </div>
    </div>
    <div class="col-sm-6 col-xs-12 d-flex flex-column pb-3">
      <h1>Details</h1>
      <div class="pt-4" style="flex: 1">
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

      <div class="mt-auto d-flex justify-content-end">
        <base-button size="large" class="mr-2">Inspect</base-button>
        <base-button class="mr-2">View</base-button>
        <base-button class="mr-2">Share</base-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const xummApiKey = import.meta.env.VITE_XUMM_API_KEY as string;

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { XummSdkJwt } from "xumm-sdk";
import type { XummTypes } from "xumm-sdk";
const Sdk = new XummSdkJwt(xummApiKey);
export default defineComponent({
  components: { BaseButton },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const trustLinePayload = ref(null);
    console.log(route.params.nftAddress);
    const {
      value: { account, user },
    } = computed(() => store.getters["xumm/getOttData"]);
    const newPayload: XummTypes.CreatePayload = {
      user_token: "c5bc4ccc-28fa-4080-b702-0d3aac97b993",
      txjson: {
        TransactionType: "TrustSet",
        Account: account,
        Flags: 131072,
        LimitAmount: {
          currency: "CURRENCY",
          issuer: user,
          value: "1000000000000000e-96",
        },
      },
    };
    const nft = await store.getters["nft/getByAddress"](
      route.params.nftAddress as string
    );

    return {
      nft,
      trustLinePayload,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      async createTrustline() {
        const created = await Sdk.payload.create(newPayload);
        trustLinePayload.value = created;
      },
    };
  },
});
</script>
