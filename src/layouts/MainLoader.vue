<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { useStore } from "vuex";
import Welcome from "@/dialogs/HeaderNavigation.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {},
  async setup() {
    const store = useStore();
    const router = useRouter();
    const isInXumm = inject("isInXumm");
    if (isInXumm) {
      await store.dispatch("xumm/getOttData");
      const ottdata = computed(() => store.getters["xumm/getOttData"]);
      store.commit("user/setAddress", ottdata.value.account);
      store.commit("user/setNodeType", ottdata.value.nodetype);
      const path = ottdata.value.redirect;
      if (path) {
        router.push({ path });
      }
    } else {
      store.commit("user/setAddress", "reWmfYP8FbRyWWEEkhpKzCpEnksg4sAwx");
      store.commit("user/setNodeType", "TESTNET");
    }

    return {};
  },
});
</script>
