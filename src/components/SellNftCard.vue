<template>
  <div style="height: 100%; overflow: hidden" class="card">
    <div style="height: 100%" class="card-body">
      <div class="d-flex justify-content-between"></div>
      <div>
        <strong class="h6 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
      </div>

      <div>
        <strong class="h7 font-weight-bold">Description </strong><br />
        <div v-html="nft.desc"></div>
      </div>
      <div style="overflow-y: scroll; height: 100%" class="card-text">
        <div class="pt-2 pb-4 px-4">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseCard from "@/components/BaseCard.vue";

export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    return {};
  },
});
</script>
