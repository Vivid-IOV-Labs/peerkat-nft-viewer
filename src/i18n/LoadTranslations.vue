<template>
  <slot />
</template>

<script lang="ts">
import { loadMessagesPromise, handleMissing } from "../i18n";

import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "LoadTranslations",
  async setup() {
    useI18n().setMissingHandler(handleMissing);

    await loadMessagesPromise;
    return {};
  },
});
</script>
