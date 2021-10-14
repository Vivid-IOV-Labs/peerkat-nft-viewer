<template>
  <button
    :class="`btn-${theme} btn-${status}`"
    class="btn btn-primary"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
var theme = (
  new URLSearchParams(document.location.href).get("xAppStyle") || "light"
).toLowerCase();
export default defineComponent({
  props: {
    status: { type: String, default: () => "success" },
  },
  setup: () => {
    return {
      theme,
    };
  },
});
</script>
<style scoped></style>
