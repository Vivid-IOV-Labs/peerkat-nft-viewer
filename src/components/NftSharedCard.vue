<template>
  <base-card style="height: 100%">
    <template #picture>
      <figure class="h-50">
        <video
          v-if="nft.media_type?.includes('video')"
          :src="`${nft.url}#t=0.5`"
          preload="metadata"
          muted
          class="img-fluid card-img-top"
          style="object-fit: cover; height: 100%; object-position: center top"
        ></video>
        <img
          v-else
          style="object-fit: cover; height: 100%; object-position: center top"
          class="img-fluid card-img-top"
          :src="nft.url"
          alt="Card image cap"
          @error="fallbackImg"
        />
      </figure>
    </template>

    <template #title>
      <strong class="h6 font-weight-bold">Token Name </strong><br />
      {{ nft.tokenName }}
    </template>
    <template #text>
      <strong class="h7 font-weight-bold">Issuer </strong><br />
      <span>{{ nft.issuer }}</span>
    </template>
    <template #footer>
      <div>
        <base-button class="mr-2" @click="deleteShared">Clear</base-button>
        <external-link
          class="mr-2"
          :url="`https://test.bithomp.com/explorer/${nft.issuer}`"
        >
          Inspect</external-link
        >
        <base-button class="mr-2" @click="view">View</base-button>
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    BaseCard,
    BaseButton,
    ExternalLink,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const router = useRouter();
    const store = useStore();

    return {
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      view() {
        router.push({
          path: `/shared/${props.nft.issuer}/${props.nft.currency}`,
        });
      },
      deleteShared() {
        store.commit("nft/deleteShared", props.nft.issuer);
      },
    };
  },
});
</script>
<style>
.truncate {
  min-width: 180px;
  max-width: 200px;
  width: 100%;
}
.untruncate {
  min-width: auto;
  max-width: auto;
}
</style>
