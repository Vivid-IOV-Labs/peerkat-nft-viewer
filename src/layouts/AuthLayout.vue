<template>
  <HeaderNavigation />
  <main style="height: 85%" class="container-fluid overflow-auto">
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
