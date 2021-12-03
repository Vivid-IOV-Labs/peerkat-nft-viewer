<template>
  <base-card>
    {{ content_type }}
    <template #picture>
      <video
        v-if="content_type?.includes('video')"
        :src="url"
        autoplay
        muted
        loop
        playsinline
        class="h-50 card-img-top"
      ></video>
      <figure>
        <img
          v-if="content_type?.includes('image')"
          class="card-img-top h-50"
          :src="url"
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
      <!-- :class="{
          'text-truncate truncate': !showIssuer,
          untruncate: showIssuer,
        }" -->
      <strong class="h7 font-weight-bold">Issuer </strong><br />
      <a
        class="btn-link d-block"
        href="#"
        aria-expanded="true"
        @click.prevent="showIssuer = !showIssuer"
        >{{ nft.issuer }}</a
      >
    </template>
    <template #footer>
      <div class="d-flex justify-content-end">
        <router-link
          :to="{ path: `/nft/${nft.issuer}/${nft.currency}/view` }"
          class="mt-4 btn btn-link"
          >View
        </router-link>
      </div>
    </template>
  </base-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseCard from "@/components/BaseCard.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { copyText } from "../utils/copytext";
async function fetchMedia(url: string) {
  const res = await fetch(url);
  const contentType = res.headers.get("Content-Type");
  return contentType;
}
export default defineComponent({
  components: {
    BaseCard,
  },
  props: {
    nft: { type: Object, required: true },
  },
  async setup(props) {
    const route = useRoute();
    const store = useStore();
    const showIssuer = ref(false);

    const url = `https://ipfs.io/ipfs/${props.nft.cid}`;
    const content_type = await fetchMedia(url);
    return {
      content_type,
      url,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      showIssuer,
      share() {
        copyText(window.location.toString());
      },
      inspect() {
        copyText(window.location.toString());
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
