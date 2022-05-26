<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between"></div>
      <div>
        <strong class="h6 font-weight-bold">Token Name </strong><br />
        {{ nft.tokenName }}
      </div>

      <div>
        <strong class="h7 font-weight-bold">Description </strong><br />
        <div v-html="nft.desc"></div>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-end pb-4">
      <slot name="footer"></slot>
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
