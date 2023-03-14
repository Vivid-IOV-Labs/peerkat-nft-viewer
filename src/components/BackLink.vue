<template>
  <a href="#" class="mb-4 btn btn-link w-100" @click="back">Back </a>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    path: { type: String, default: null },
    query: { type: Object, default: undefined },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const lastView = computed(() => store.getters["ui/getLastView"]);
    return {
      back() {
        if (props.path) {
          router.push({ path: props.path });
        } else {
          router.push({ path: lastView.value });
        }
      },
    };
  },
});
</script>
