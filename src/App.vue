<template>
  <div>
    <auth-layout>
      <router-view></router-view>
    </auth-layout>
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
});
</script>
