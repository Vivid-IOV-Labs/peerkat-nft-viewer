<template>
  <div
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
      flex-direction: column;
      padding: 0.6rem;
      text-align: center;
    "
  >
    <div
      style="
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: center;
        flex-direction: column;
        text-align: center;
      "
    >
      <h5 class="mt-2">
        For any queries, help or to provide feedback please email us at:
      </h5>
      <h4 class="mt-2">
        <base-button @click="copyEmail"
          >support@peerkat.io
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="width: 18px; height: 18px"
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
    </div>

    <div style="font-size: 0.8rem">
      <div class="d-flex justify-content-center my-2">
        <external-link :url="`https://www.vividiov.com/privacy/`" class="mr-2"
          >Privacy notice</external-link
        >
      </div>
      <p><strong>© Peerkat 2022</strong></p>
      <p>
        <strong>Peerkat</strong> is a <strong>Vivid IoV Labs</strong> company”
      </p>
      <p>
        Vivid IoV Labs, Innovation Labs, England, IP14 1RD.<br />
        Vivid IoV Labs Ltd is a company registered in England and Wales with
        company number 12452820
      </p>
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
          title: "Email Info",
          text: "Copied to clipboard",
        });
      },
    };
  },
});
</script>
