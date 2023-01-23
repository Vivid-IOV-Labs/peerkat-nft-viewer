<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-column justify-content-between">
        <div class="d-flex justify-content-between">
          <div class="col-4">
            <figure style="overflow: hidden; height: 90px">
              <a
                class="h-100 d-block"
                style="overflow: hidden"
                href="#"
                @click.prevent="view"
              >
                <load-media :nft="nft"></load-media>
              </a>
            </figure>
          </div>
          <div class="col-8 d-flex flex-column">
            <div v-if="nft.tokenName" class="">
              <strong class="h6 font-weight-bold">Token Name </strong><br />
              <span style="font-size: 0.8rem">{{ nft.tokenName }}</span>
            </div>
            <div v-if="nft.desc">
              <strong class="h7 font-weight-bold">Description </strong><br />
              <div style="font-size: 0.8rem" v-html="nft.desc"></div>
            </div>
          </div>
        </div>
        <div>
          <strong class="h6 font-weight-bold">Token ID </strong><br />
          <span style="font-size: 0.8rem">{{ nft.currency }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="card-footer mt-auto d-flex justify-content-end pb-4">
      <slot name="footer"></slot>
       <external-link v-if="bihompUrl" class="ml-2" :url="bihompUrl">
        Inspect</external-link
      > 
    </div> -->
  </div>
</template>
<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { getNetworkCodeFromType } from "../utils/getNetworkTypeFromCode";
import LoadMedia from "@/components/LoadMedia.vue";

export default defineComponent({
  components: {
    LoadMedia,
  },
  props: {
    nft: { type: Object, required: true },
    shared: { type: Boolean, default: false },
  },
  async setup(props) {
    const store = useStore();
    const network = computed(() => store.getters["user/getNetwork"]);
    const router = useRouter();
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const nodetypecode = computed(() => getNetworkCodeFromType(nodetype.value));

    const bithomID =
      props.nft.standard && props.nft.standard === "XLS-20"
        ? props.nft.currency
        : props.nft.issuer;

    const bihompUrl = computed(() => getInspectorUrl(network.value, bithomID));
    return {
      bihompUrl,
      view() {
        router.push({
          path: props.shared
            ? `/shared/${props.nft.issuer}/${nodetypecode.value}/view/${props.nft.currency}`
            : `/wallet/${props.nft.issuer}/view/${props.nft.currency}`,
        });
      },
    };
  },
});
</script>
