<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-column justify-content-between">
        <div class="d-flex justify-content-between">
          <div class="col-4">
            <figure style="overflow: hidden; height: 100px">
              <a
                class="h-100 d-block"
                style="overflow: hidden"
                href="#"
                @click.prevent="view"
              >
                <video
                  v-if="nft.media_type?.includes('video')"
                  :src="nft.url"
                  poster="/thumbnail.jpg"
                  muted
                  class="img-fluid card-img-top"
                  style="
                    object-fit: cover;
                    height: 100%;
                    object-position: center top;
                  "
                ></video>
                <img
                  v-else-if="nft.media_type?.includes('image')"
                  v-lazy="nft.url"
                  style="
                    object-fit: cover;
                    height: 100%;
                    object-position: center top;
                  "
                  class="img-fluid card-img-top"
                  alt="Card
          image cap"
                />
                <img
                  v-else
                  :src="'/thumbnail.jpg'"
                  style="
                    object-fit: cover;
                    height: 100%;
                    object-position: center top;
                  "
                  class="img-fluid card-img-top"
                  alt="Card
          image cap"
                />
              </a>
            </figure>
          </div>
          <div class="col-8 d-flex flex-column">
            <div class="">
              <strong class="h6 font-weight-bold">Token Name </strong><br />
              <span style="font-size: 0.8rem">{{ nft.tokenName }}</span>
            </div>
            <div>
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
import { useRouter } from "vue-router";
import ExternalLink from "@/components/ExternalLink.vue";
import { getInspectorUrl } from "../utils/getInspectorUrl";
import { getNetworkCodeFromType } from "../utils/getNetworkTypeFromCode";

export default defineComponent({
  components: {
    ExternalLink,
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

    const bihompUrl = computed(() =>
      getInspectorUrl(network.value, props.nft.currency)
    );

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
