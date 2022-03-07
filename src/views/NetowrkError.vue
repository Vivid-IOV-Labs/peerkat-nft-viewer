<template>
  <div style="height: 100%; margin-top: 13%">
    <h5 class="mt-2 text-center">Netowrk Error please try again later</h5>
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
