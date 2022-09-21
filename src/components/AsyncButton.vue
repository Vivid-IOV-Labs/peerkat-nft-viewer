<template>
  <base-button
    :skin="skin"
    :outline="outline"
    :size="size"
    :disabled="loading"
    @click.prevent="click"
  >
    <div v-if="loading">
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <slot v-else />
  </base-button>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { delay } from "../utils/delay";

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    onClick: { type: Function, required: true },
    skin: { type: String, default: () => "primary" },
    outline: { type: Boolean, default: () => false },
    size: { type: String, default: () => "medium" },
    element: { type: String, default: () => "button" },
  },
  setup(props) {
    const loading = ref(false);
    return {
      loading,
      async click() {
        try {
          loading.value = true;
          await props.onClick();
          await delay(1000);
        } finally {
          loading.value = false;
        }
      },
    };
  },
});
</script>
