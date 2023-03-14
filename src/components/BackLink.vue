<template>
  <a href="#" class="mb-4 btn btn-link w-100" @click="back">Back </a>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    path: { type: String, default: null },
    query: { type: Object, default: undefined },
  },
  async setup() {
    const router = useRouter();

    return {
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
