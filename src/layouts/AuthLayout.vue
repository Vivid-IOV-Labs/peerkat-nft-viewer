<template>
  <HeaderNavigation style="height: 20%" />
  <main style="height: 80%" class="container-fluid">
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
