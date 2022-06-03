<template>
  <pre>{{ sharedSellOffers }}</pre>
  <router-view></router-view>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  async setup() {
    const store = useStore();
    const sharedSellOffers = computed(() => {
      return store.getters["nft/getSharedSellOffers"];
    });
    return {
      sharedSellOffers,
    };
  },
});
</script>
