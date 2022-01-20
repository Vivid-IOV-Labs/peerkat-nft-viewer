<template>
  <div
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
      flex-direction: column;
      padding: 0.6rem;
    "
  >
    <h5 class="text-center mt-2">For any queries or help please email us at</h5>
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
