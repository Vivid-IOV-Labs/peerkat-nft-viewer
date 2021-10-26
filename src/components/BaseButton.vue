<template>
  <button :class="`btn-primary`" class="btn btn-primary">
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
    status: { type: String, default: () => "primary" },
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
  background: #3052ff;
}
.btn-light {
  background: #f3f5ff;
}
.btn-light {
  background: #7082f9;
}
</style>
