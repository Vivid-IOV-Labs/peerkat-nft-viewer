<template>
  <div style="height: 100%; margin-top: 13%">
    <div>
      <h5 class="mt-2 text-center">
        For any queries, help or to provide feedback please email us at:
      </h5>
      <h4 class="mt-1 mb-4 text-center">
        <base-button class="mb-4" @click="copyEmail"
          >support@peerkat.io
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 18px; height: 18px; vertical-align: middle"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            /></svg
        ></base-button>
      </h4>
      <h5 class="mt-4 text-center bold">FAQs</h5>
      <ul class="mt-2 mb-4">
        <li class="pb-2">
          <strong>Why is my NFT's artwork not being displayed? </strong><br />
          It could be due to a slow connection or the viewer is unable to read
          the metadata (referencing where the NFT asset is stored). <br />If you
          can view the NFT details & attributes in the viewer the error is most
          likely due to a slow connection where the network times out. This
          error occurs most frequently when using a public IPFS link. Please try
          again by quitting the xApp and reload.<br />
          We are actively working on increasing the viewer’s support for
          different types of metadata so that your NFT artwork will be visible
          in the future.
        </li>
        <li class="pb-2">
          <strong> What XLS20 artwork metadata does this xApp support? </strong>
          <br />For XLS20 NFTs our xApp is compatible with XLS24d and OpenSea
          metadata standards. If your XLS20 NFT artwork is not displayed we
          advise you to request support from the Token Issuer and/or service
          used to acquire the NFT.
        </li>
        <li class="pb-2">
          <strong> What are the sell offers and buy offers?</strong>
          <br />In the xApp we display any current offers for the NFT made via
          the XRP Ledger.<br />
          Sell offers are the prices that the owner of the NFT has set for the
          sale of the NFT, whereas buy offers are made by another account who
          has made a bid to purchase the NFT.
        </li>
        <li class="pb-2">
          <strong> What features are being added next?</strong>
          <br />NFT Analytics are next on our roadmap. Please suggest any other
          features you would like to see by getting in contact with us.
        </li>
      </ul>
    </div>
    <p class="mt-4 text-center text-small">
      Please follow us via Twitter and our website for updates, airdrop news and
      product releases
    </p>
    <div style="font-size: 0.8rem">
      <nav class="d-flex justify-content-center mb-4">
        <external-link
          class="mr-2 btn btn-primary btn-sm"
          :url="`https://twitter.com/PeerkatOfficial`"
          >@PeerkatOfficial</external-link
        >
        <external-link
          class="mr-2 btn btn-primary btn-sm"
          :url="`https://discord.com/invite/mAHEN8kCdr`"
          >Discord
        </external-link>
        <external-link
          class="mr-2 btn btn-primary btn-sm"
          :url="`https://peerkat.com/privacy`"
          >Privacy notice</external-link
        >
      </nav>
      <div class="mt-4 pb-2 text-center">
        <p>© Peerkat 2023</p>
        <p>Peerkat is a Vivid IoV Labs product</p>
        <p>
          Vivid IoV Labs, Innovation Labs, England, IP14 1RD.<br />
          Vivid IoV Labs Ltd is a company registered in England and Wales with
          company number 12452820.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { copyText } from "../utils/copytext";

export default defineComponent({
  components: {
    ExternalLink,
    BaseButton,
  },
  async setup() {
    return {
      copyEmail() {
        copyText("support@peerkat.io", {
          title: "Email Peerkat",
          text: "Copied to clipboard",
        });
      },
    };
  },
});
</script>
