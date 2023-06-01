<template>
  <div style="height: 70vh">
    <BackLink />
    <div v-if="nft && nft.standard == 'XLS-20'" class="h-100">
      <div class="d-flex p-2 justify-content-center">
        <button
          v-for="asset in assets"
          :key="asset"
          class="btn btn-primary btn-sm mr-2"
          @click="selectAsset(asset)"
        >
          {{ asset }}
        </button>
      </div>
      <figure v-for="asset in assets" :key="asset" class="w-100">
        <load-asset
          v-if="asset == selectedAsset"
          :autoplay="true"
          :controls="true"
          :asset="asset"
          :nft="nft"
        ></load-asset>
      </figure>
    </div>
    <div v-if="nft && nft.standard !== 'XLS-20'" class="h-100">
      <figure class="w-100">
        <load-media :autoplay="true" :controls="true" :nft="nft"></load-media>
      </figure>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import LoadMedia from "@/components/LoadMedia.vue";
import LoadAsset from "@/components/LoadAsset.vue";
import BackLink from "@/components/BackLink.vue";

const filterObject = (obj: any, predicate: any) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));
export default defineComponent({
  components: {
    LoadMedia,
    LoadAsset,
    BackLink,
  },
  setup() {
    const store = useStore();
    const nft = computed(() => {
      return store.getters["nft/getCurrent"];
    });
    const selectedAsset = ref("image");

    const assets = computed(() => {
      if (nft.value) {
        const filteredAssets = filterObject(
          nft.value.assets,
          ([k, v]: any) => v
        );
        return Object.keys(filteredAssets);
      } else {
        return [];
      }
    });
    return {
      nft,
      assets,
      selectedAsset,
      selectAsset(asset: string) {
        selectedAsset.value = asset;
      },
    };
  },
});
</script>
