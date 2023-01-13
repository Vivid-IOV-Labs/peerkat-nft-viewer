<template>
  <div style="height: 70vh">
    <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>
    <div v-if="nft" class="h-100">
      <figure class="w-100">
        <load-media :nft="nft"></load-media>
      </figure>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import LoadMedia from "@/components/LoadMedia.vue";

export default defineComponent({
  components: {
    LoadMedia,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { currency, nftAddress } = route.params;
    const nft = computed(() => {
      return store.getters["nft/getByAddress"](nftAddress, currency);
    });
    return {
      nft,
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
