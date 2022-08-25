<template>
  <base-button v-if="isInXumm" href="#" @click="openLink">
    <slot />
  </base-button>
  <a v-else :href="url" target="_blank" class="btn btn-primary btn-sm">
    <slot />
  </a>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
//import { openBrowser } from "../utils/XummActions";
import XummSdk from "../services/XummService";

import BaseButton from "./BaseButton.vue";
export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    url: { type: String, default: () => "" },
  },
  setup: (props) => {
    return {
      isInXumm: inject("isInXumm"),
      openLink() {
        XummSdk.openBrowser(props.url);
      },
    };
  },
});
</script>
