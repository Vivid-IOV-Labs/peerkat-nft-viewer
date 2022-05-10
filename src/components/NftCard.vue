<template>
  <base-card>
    <template #picture>
      <figure style="overflow: hidden; height: 100%">
        <a
          class="h-100 d-block"
          style="overflow: hidden"
          href="#"
          @click.prevent="view"
        >
          <video
            v-if="nft.media_type?.includes('video')"
            :src="`${nft.url}#t=0.5`"
            poster="/thumbnail.jpg"
            muted
            class="img-fluid card-img-top"
            style="object-fit: cover; height: 100%; object-position: center top"
          ></video>
          <img
            v-else-if="nft.media_type?.includes('image')"
            v-lazy="nft.url"
            style="object-fit: cover; height: 100%; object-position: center top"
            class="img-fluid card-img-top"
            alt="Card
          image cap"
          />
          <img
            v-else
            :src="'/thumbnail.jpg'"
            style="object-fit: cover; height: 100%; object-position: center top"
            class="img-fluid card-img-top"
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
      <span>{{ nft.issuer }}</span
      ><br />
      <div v-if="nft.balanceFormatted || nft.limitFormatted" class="mt-2">
        <strong v-if="nft.balanceFormatted" class="h7 font-weight-bold"
          >Balance
        </strong>
        <span v-if="nft.balanceFormatted" class="mr-3"
          >{{ nft.balanceFormatted }}
        </span>
        <strong v-if="nft.limitFormatted" class="h7 font-weight-bold"
          >Total Supply
        </strong>
        <span v-if="nft.limitFormatted">{{ nft.limitFormatted }}</span>
      </div>
      <div v-if="nft.author" class="mt-2">
        <strong class="h7 font-weight-bold">Author </strong><br />
        <span class="mr-3">{{ nft.author }} </span>
      </div>
      <div v-if="nft.desc" class="mt-2">
        <strong class="h7 font-weight-bold">Description </strong><br />
        <div v-html="nft.desc"></div>
      </div>
      <div v-if="nft.standard" class="mt-2">
        <strong class="h7 font-weight-bold">Standard </strong><br />
        <span>{{ nft.standard }}</span>
      </div>
    </template>
    <template #footer>
      <div>
        <base-button
          v-if="nft.standard == 'XLS-20'"
          class="mr-2"
          @click="openSellDialog"
          >Sell</base-button
        >
        <base-button class="mr-2" @click="share">Share</base-button>
        <external-link v-if="bihompUrl" class="mr-2" :url="bihompUrl">
          Inspect</external-link
        >
      </div>
    </template>
  </base-card>
  <base-dialog v-model="toggleSellDialog" :cancellable="true" title="Sell">
    <template #body>
      <strong class="h6 font-weight-bold">Token Name </strong><br />
      {{ nft.tokenName }}<br />
      <strong class="h7 font-weight-bold">Token ID </strong><br />
      <span style="word-break: break-all">{{ nft.currency }}</span
      ><br />
      <div v-if="nft.desc" class="mt-2">
        <strong class="h7 font-weight-bold">Description </strong><br />
        <div v-html="nft.desc"></div>
      </div>
      <div class="form-group flex justify-between">
        <base-input
          id="saleamount"
          v-model="saleamount"
          :label-hidden="true"
          label-text="saleamount"
          type="number"
        ></base-input>
        <strong>XRP</strong>
      </div>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="confirmSell">Confirm</base-button>
      </div>
    </template></base-dialog
  >
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { copyText } from "../utils/copytext";
import { useStore } from "vuex";
import { getNetworkCodeFromType } from "../utils/getNetworkTypeFromCode";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { openSignRequest } from "../utils/XummActions";
import XummSdk from "../services/XummService";
import { devlog } from "../utils/devlog";

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    ExternalLink,
    BaseDialog,
    BaseInput,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const toggleSellDialog = ref(false);
    const saleamount = ref(0);
    const router = useRouter();
    const store = useStore();
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const network = computed(() => store.getters["user/getNetwork"]);
    const user = computed(() => store.getters["user/getUser"]);
    const walletAddress = computed(() => store.getters["user/getAddress"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.nft.issuer)
    );

    const passNFTIssuerOrXUMMowner =
      props.nft.standard && props.nft.standard === "XLS20"
        ? user.value
        : props.nft.issuer;
    function shareUrl(nodetypecode: number | undefined) {
      const xummSandbox = import.meta.env.VITE_XUMM_SANDBOX;
      return xummSandbox === "test"
        ? `https://xumm.app/detect/xapp:peerkat.sandbox.test?redirect=/shared/${passNFTIssuerOrXUMMowner}/${nodetypecode}/${props.nft.currency}`
        : xummSandbox === "dev"
        ? `https://xumm.app/detect/xapp:peerkat.dev?redirect=/shared/${passNFTIssuerOrXUMMowner}/${nodetypecode}/${props.nft.currency}`
        : `https://xumm.app/detect/xapp:peerkat.viewer?redirect=/shared/${passNFTIssuerOrXUMMowner}/${nodetypecode}/${props.nft.currency}`;
    }
    return {
      saleamount,
      toggleSellDialog,
      confirmSell() {
        try {
          const transactionBlob = {
            TransactionType: "NFTokenCreateOffer",
            Account: walletAddress.value,
            TokenID: props.nft.currency,
            Amount: saleamount.value,
            Flags: 1, //parseInt(flags.value)
          };
          XummSdk.createPayload({
            // user_token: user.value,
            txjson: {
              TransactionType: "Payment",
              Destination: "rsC8uuD5EzkDJESoFbttHWZxzNv8JYdmCw",
              Fee: "12",
            },
          });
          devlog("CretaPayload", {
            user_token: user.value,
            txjson: transactionBlob,
          });
        } catch (error) {
          devlog("CretaPayload", error);
        }

        // openSignRequest(user.value);
      },
      openSellDialog() {
        toggleSellDialog.value = true;
      },
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      bihompUrl,
      share() {
        const nodetypecode = getNetworkCodeFromType(nodetype.value);

        const params = {
          title: "Share NFT link",
          text: "Copied to clipboard",
        };

        const url = shareUrl(nodetypecode);
        copyText(url, params);
      },
      view() {
        router.push({
          path: `/wallet/${props.nft.issuer}/view/${props.nft.currency}`,
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
