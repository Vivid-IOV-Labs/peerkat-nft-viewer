<template>
  <div style="height: 70vh">
    <BackLink />
    <div v-if="nft" class="h-100">
      <figure class="w-100">
        <load-media :autoplay="true" :controls="true" :nft="nft"></load-media>
      </figure>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import LoadMedia from "@/components/LoadMedia.vue";
import BackLink from "@/components/BackLink.vue";

export default defineComponent({
  components: {
    LoadMedia,
    BackLink,
  },
  setup() {
    const store = useStore();
    const nft = computed(() => {
      return store.getters["nft/getCurrent"];
    });
    return {
      nft,
    };
  },
});
</script>
