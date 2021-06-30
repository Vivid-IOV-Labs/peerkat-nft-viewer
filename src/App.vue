<template>
  <div v-if="withAuthLayout">
    <auth-layout>
      <router-view></router-view>
    </auth-layout>
  </div>
  <div v-else class="container px-6 pt-4 pb-6 h-screen">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
export default defineComponent({
  name: "App",
  components: {
    AuthLayout,
  },
  computed: {
    withAuthLayout() {
      return this.$route.meta.withAuth;
    },
  },
});
</script>
