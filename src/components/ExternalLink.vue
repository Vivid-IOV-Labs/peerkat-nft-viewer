<template>
  <a v-if="isInXumm" href="#" @click="openLink">
    <slot />
  </a>
  <a v-else :href="url" target="_blank">
    <slot />
  </a>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import XummService from "../services/XummService";

export default defineComponent({
  props: {
    url: { type: String, default: () => "" },
  },
  setup: (props) => {
    return {
      isInXumm: inject("isInXumm"),
      openLink() {
        XummService.openBrowser(props.url);
      },
    };
  },
});
</script>
