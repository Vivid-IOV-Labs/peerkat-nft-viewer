<template>
  <button :class="`btn-${skin} btn-${size}`" class="btn">
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
    skin: { type: String, default: () => "primary" },
    size: { type: String, default: () => "sm" },
  },
  setup: () => {
    return {
      theme,
    };
  },
});
</script>

<style>
.btn-primary {
  background: #3052ff !important;
}
.btn-primary:hover {
  background: #7082f9 !important;
}
.btn-light {
  background: #f3f5ff;
}
.btn-light {
  background: #7082f9;
}
</style>
