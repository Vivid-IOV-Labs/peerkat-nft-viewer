<template>
  <button :class="`btn-${theme} btn-${status}`" class="btn btn-primary">
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
<style scoped>
.btn-success {
  background: #3bdc96;
}
.btn-info {
  background: #3052ff;
}
.btn-warning {
  background: #f8bf4c;
}

.btn-danger {
  background: #ff5b5b;
}
</style>
