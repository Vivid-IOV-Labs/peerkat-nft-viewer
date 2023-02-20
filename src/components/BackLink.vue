<template>
  <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    path: { type: String, default: null },
  },
  async setup(props) {
    const router = useRouter();

    return {
      back() {
        if (props.path)
          router.push({
            path: `${props.path}`,
            replace: true,
          });
        else router.go(-1);
      },
    };
  },
});
</script>
