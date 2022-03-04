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
      <h5 class="mt-4 text-center bold">
        FAQs <small><br />last updated 2 March 2022</small>
      </h5>
      <ul class="mt-2 mb-4 p-2">
        <li class="pb-2">
          <strong>Why is my NFT's artwork not being displayed? </strong><br />
          It could be that the viewer is unable to read the metadata
          (referencing where the NFT asset is stored). If you are unable to view
          the NFT artwork it is likely that the token is using XLS15 or XLS16
          for storing metadata. We are actively working on increasing the
          viewer’s support to this metadata so that your NFT artwork will be
          visible in the future.
        </li>
        <li class="pb-2">
          <strong>
            Will you support XLS14/SOLO and other NFT variations?</strong
          >
          <br />We are currently investigating support for XLS14/SOLO. We may
          also add support for other NFT variations we discover where it is
          feasible to do so.
        </li>
        <li class="pb-2">
          <strong> What features are being added next?</strong>
          <br />XLS20 support, one click XLS14 > 20 upgrader & NFT Analytics.
          Please suggest any other features you would like to see by getting in
          contact with us.
        </li>
      </ul>
    </div>
    <p class="mt-4 text-center text-small">
      Please follow us via Twitter and our website for updates, airdrop news and
      product releases
    </p>
    <div style="font-size: 0.8rem">
      <nav class="d-flex justify-content-center mb-4">
        <external-link class="mr-2" :url="`https://twitter.com/PeerkatOfficial`"
          >@PeerkatOfficial</external-link
        >
        <external-link class="mr-2" :url="`https://peerkat.io`"
          >Peerkat.io
        </external-link>
        <external-link class="mr-2" :url="`https://peerkat.io/privacy`"
          >Privacy notice</external-link
        >
      </nav>
      <div class="mt-4 pb-2 text-center">
        <p>© Peerkat 2022</p>
        <p>Peerkat is a Vivid IoV Labs company</p>
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
