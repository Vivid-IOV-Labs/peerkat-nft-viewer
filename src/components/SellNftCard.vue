<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div>
          <div>
            <strong class="h6 font-weight-bold">Token Name </strong><br />
            {{ nft.tokenName }}
          </div>

          <div>
            <strong class="h7 font-weight-bold">Description </strong><br />
            <div v-html="nft.desc"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-end pb-4">
      <slot name="footer"></slot>
      <external-link v-if="bihompUrl" class="ml-2" :url="bihompUrl">
        Inspect</external-link
      >
    </div>
  </div>
</template>
<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import ExternalLink from "@/components/ExternalLink.vue";
import { getInspectorUrl } from "../utils/getInspectorUrl";
export default defineComponent({
  components: {
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.nft.currency)
    );

    return { bihompUrl };
  },
});
</script>
