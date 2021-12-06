<template>
  <HeaderNavigation style="height: 12%" />
  <main style="height: 88%" class="container-fluid">
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
