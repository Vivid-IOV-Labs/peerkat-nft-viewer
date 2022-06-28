<template>
  <div v-if="nft">
    <h2 class="text-center">Create Buy Offer</h2>
    <div class="w-80 p-1">
      <base-card v-if="nft">
        <template #picture>
          <figure style="overflow: hidden">
            <a href="#">
              <video
                v-if="nft.media_type?.includes('video')"
                :src="nft.url"
                muted
                class="img-fluid card-img"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
              />
              <img
                v-else-if="nft.media_type?.includes('image')"
                v-lazy="nft.url"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
                class="img-fluid card-img"
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
                class="img-fluid card-img"
                alt="Card
          image cap"
              />
            </a>
          </figure>
        </template>
        <template #title>
          <strong class="h6 font-weight-bold">Token Name </strong><br />
          {{ nft.tokenName }}
        </template>

        <template #text>
          <div v-if="nft.author" class="mt-2">
            <strong class="h7 font-weight-bold">Author </strong><br />
            <span class="mr-3">{{ nft.author }} </span>
          </div>
          <div v-if="nft.desc" class="mt-2">
            <strong class="h7 font-weight-bold">Description </strong><br />
            <span>{{ nft.desc }}</span>
          </div>
          <div v-if="nft.currency" class="mt-2">
            <strong class="h7 font-weight-bold">Tokent ID </strong><br />
            <span>{{ nft.currency }}</span>
          </div>
        </template>
        <template #footer>
          <async-button :on-click="accept"> Accept </async-button>
        </template>
      </base-card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BaseCard from "../components/BaseCard.vue";
import AsyncButton from "../components/AsyncButton.vue";

import { getNetworkTypeFromCode } from "../utils/getNetworkTypeFromCode";

export default defineComponent({
  components: { BaseCard, AsyncButton },
  async setup() {
    const route = useRoute();
    const store = useStore();
    const nft = computed(() => {
      const { currency, nftAddress, nodetype } = route.params;

      return store.getters["nft/getSharedByAddress"](
        nftAddress,
        getNetworkTypeFromCode(parseInt(nodetype as string)),
        currency
      );
    });
    return {
      nft,
      async accept() {
        await store.commit("nft");
      },
    };
  },
});
</script>
