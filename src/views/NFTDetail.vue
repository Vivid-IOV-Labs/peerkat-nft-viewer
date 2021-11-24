<template>
  <base-select
    id="lang"
    v-model="$i18n.locale"
    :choices="pages"
    label-text="Select Language"
    :as-val="true"
    :label-hidden="true"
    style="width: 200px"
  ></base-select>
  <div class="row flex items-center">
    <div class="col-sm-4 col-offset-2 col-xs-12">
      <div class="">
        <figure>
          <img
            class="card-img"
            :src="nft.url"
            alt="Card image cap"
            @error="fallbackImg"
          />
        </figure>
      </div>
    </div>
    <div class="col-sm-8 col-xs-12 pb-3">
      <base-card style="height: 100%; width: 100%" class="d-flex flex-column">
        <template #title>
          <h1>Details</h1>
        </template>
        <template #text style="flex: 1">
          <div class="pt-4">
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
        </template>
        <template #footer>
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
        </template>
      </base-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
import type { XummTypes } from "xumm-sdk";
import { createPaylod } from "../services/XummService";
import { fetchOne } from "../services/XrpService";
import BaseSelect from "@/components/BaseSelect.vue";

export default defineComponent({
  components: { BaseButton, BaseCard, BaseSelect },
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
          console.log("got events ", always);
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
      pages: [
        { label: "VIEW", value: "view" },
        { label: "LIST", value: "list" },
      ],
    };
  },
});
</script>
