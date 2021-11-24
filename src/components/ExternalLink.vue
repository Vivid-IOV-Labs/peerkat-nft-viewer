<template>
  <a v-if="isInXumm" href="#" class="btn btn-link" @click="openLink">
    <slot />
  </a>
  <a :href="url" target="_blank" class="btn btn-link">
    <slot />
  </a>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
import { openBrowser } from "../utils/XummActions";

export default defineComponent({
  props: {
    url: { type: String, default: () => "" },
  },
  setup: (props) => {
    return {
      isInXumm: inject("isInXumm"),
      openLink() {
        openBrowser(props.url);
      },
    };
  },
});
</script>
