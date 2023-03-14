<template>
  <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    path: { type: String, default: null },
    query: { type: Object, default: undefined },
  },
  async setup(props) {
    const router = useRouter();

    return {
      back() {
        // if (props.path)
        //   router.push({
        //     path: `${props.path}`,
        //     query: props.query,
        //     replace: true,
        //   });
        // else
        router.go(-1);
      },
    };
  },
});
</script>
