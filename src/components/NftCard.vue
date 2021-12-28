<template>
  <base-card style="height: 100%">
    <template #picture>
      <figure class="h-50">
        <video
          v-if="nft.media_type?.includes('video')"
          :src="`${nft.url}#t=0.5`"
          preload="metadata"
          muted
          class="img-fluid card-img-top"
          style="object-fit: cover; height: 100%; object-position: center top"
        ></video>
        <img
          v-else
          style="object-fit: cover; height: 100%; object-position: center top"
          class="img-fluid card-img-top"
          :src="nft.url"
          alt="Card image cap"
          @error="fallbackImg"
        />
      </figure>
    </template>

    <template #title>
      <strong class="h6 font-weight-bold">Token Name </strong><br />
      {{ nft.tokenName }}
    </template>
    <template #text>
      <!-- :class="{
          'text-truncate truncate': !showIssuer,
          untruncate: showIssuer,
        }" -->
      <strong class="h7 font-weight-bold">Issuer </strong><br />
      <a
        class="btn-link d-block"
        href="#"
        aria-expanded="true"
        @click.prevent="showIssuer = !showIssuer"
        >{{ nft.issuer }}</a
      >
    </template>
    <template #footer>
      <div>
        <!-- <base-button class="mr-2" @click="createTrustline"
          >Trustline</base-button
        > -->
        <external-link
          class="mr-2"
          :url="`https://test.bithomp.com/explorer/${nft.issuer}`"
        >
          Inspect</external-link
        >
        <base-button class="mr-2" @click="share">Share</base-button>
        <base-button class="mr-2" @click="view">View</base-button>
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
import { openSignRequest } from "../utils/XummActions";
import { createPaylod } from "../services/XummService";
import { XummTypes } from "xumm-sdk";

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const showIssuer = ref(false);

    return {
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      showIssuer,
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
              currency: props.nft.currency,
              issuer: props.nft.issuer,
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
        router.push({
          path: `/nft/${props.nft.issuer}/${props.nft.currency}/update`,
        });
        //copyText(window.location.toString());
      },
      inspect() {
        copyText(window.location.toString());
      },
      view() {
        router.push({
          path: `/nft/${props.nft.issuer}/view`,
        });
      },
    };
  },
});
</script>
<style>
.truncate {
  min-width: 180px;
  max-width: 200px;
  width: 100%;
}
.untruncate {
  min-width: auto;
  max-width: auto;
}
</style>
