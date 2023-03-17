<template>
  <HeaderNavigation style="height: 10% !important" />
  <main style="flex: 1" class="d-flex flex-column px-2 container-fluid pb-4">
    <slot></slot>
  </main>
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
