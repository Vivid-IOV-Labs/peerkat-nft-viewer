<template>
  <HeaderNavigation />
  <div class="mt-4">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderNavigation from "@/components/HeaderNavigation.vue";
export default defineComponent({
  components: {
    HeaderNavigation,
  },
});
</script>
