<template>
  <div class="rounded overflow-hidden border w-full bg-white shadow-lg">
    <div class="w-full flex justify-between p-3">
      <div class="flex w-full flex-col justify-between">
        <span class="pt-1 font-bold text-xl">{{ title }}</span>
        <div class="flex mt-2">
          <span
            v-if="nft.current_status"
            class="
              inline-flex
              items-center
              justify-center
              px-2
              py-1
              mr-2
              text-xs
              font-bold
              leading-none
              text-red-100
              bg-red-600
              rounded-full
            "
            >{{ nft.current_status }}</span
          >
        </div>
      </div>
    </div>
    <figure class="w-full h-22">
      <img
        class="w-full object-cover object-centerz"
        :src="posterUrl"
        @error="fallbackImg"
      />
    </figure>
    <div class="px-3 pb-2">
      <div class="pt-2">
        <span class="text-sm text-gray-400 font-medium"
          >Categories: {{ categories }}</span
        >
      </div>
      <div class="pt-2">
        <span class="text-sm text-gray-400 font-medium">Tags:{{ tags }}</span>
      </div>
      <div class="pt-1">
        <div class="mb-2">
          {{ subtitle }}
        </div>
      </div>
      <div class="pt-1">
        <p>{{ description }}</p>
      </div>
      <div class="border-t-2 p-4 flex justify-end">
        <base-button v-if="canDelete" class="mr-2" @click="deleteNFT"
          >Delete</base-button
        >
        <base-button v-if="canApprove" class="mr-2" @click="deleteNFT"
          >Approve</base-button
        >
        <base-button v-if="canReject" class="mr-2" @click="deleteNFT"
          >Reject</base-button
        >
      </div>
    </div>
    <base-dialog
      :show="isDeleteDialogOpen"
      title="Delete Media"
      @close="isDeleteDialogOpen = false"
    >
      <template #body>
        <p>
          Do you want to delete <strong>{{ nft.details.title }}</strong> ?
        </p>
      </template>
      <template #footer>
        <base-button class="ml-2" @click="isDeleteDialogOpen = false">
          Delete
        </base-button>
      </template>
    </base-dialog>
  </div>
</template>
<script lang="ts">
import BaseButton from "../components/BaseButton.vue";
import BaseDialog from "../components/BaseDialog.vue";
import { PropType } from "vue";
import { NFT } from "../models/NFT";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, defineComponent } from "vue";

export default defineComponent({
  components: {
    BaseButton,
    BaseDialog,
  },
  props: {
    nft: { type: Object as PropType<NFT>, required: true },
  },
  setup: (props) => {
    const store = useStore();
    const router = useRouter();
    const isDeleteDialogOpen = ref(false);
    return {
      isDeleteDialogOpen,

      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      deleteNFT(): void {
        isDeleteDialogOpen.value = true;
        console.log(213);
      },
    };
  },
  computed: {
    canDelete(): boolean {
      return (
        ["created", "deleted"].includes(this.nft.current_status) &&
        ["brand/worker", "brand/manager"].includes(
          localStorage.getItem("user-role") || ""
        )
      );
    },
    canApprove(): boolean {
      return (
        ["created"].includes(this.nft.current_status) &&
        localStorage.getItem("user-role") == "brand/manager"
      );
    },
    canReject(): boolean {
      return (
        ["created"].includes(this.nft.current_status) &&
        localStorage.getItem("user-role") == "brand/manager"
      );
    },
    tokenName(): string {
      return this.nft.details.token_name;
    },
    // videoUrl() {
    //   const url = `${env.media_server}/${this.nftID}.mp4`;
    //   return url;
    // },
    // hlsUrl() {
    //   const url = `${env.media_hls}/${this.nftID}.m3u8`;
    //   return url;
    // },
    posterUrl(): string {
      return this.nft.details.mediaurl;
    },
    title(): string {
      if (this.nft && this.nft.details && this.nft.details.title) {
        return this.nft.details.title;
      } else {
        return "";
      }
    },
    tags(): string {
      if (this.nft && this.nft.details && this.nft.details.tags) {
        return this.nft.details.tags
          .reduce((acc, tag) => {
            acc += ` #${tag},`;
            return acc;
          }, "")
          .slice(1, -1);
      } else {
        return "";
      }
    },
    categories(): string {
      if (this.nft && this.nft.details && this.nft.details.categories) {
        return this.nft.details.categories
          .reduce((acc, tag) => {
            acc += `${tag},`;
            return acc;
          }, "")
          .slice(1, -1);
      } else {
        return "";
      }
    },
    subtitle(): string {
      if (this.nft && this.nft.details && this.nft.details.subtitle) {
        return this.nft.details.subtitle;
      } else {
        return "";
      }
    },
    description(): string {
      if (this.nft && this.nft.details && this.nft.details.description) {
        return this.nft.details.description;
      } else {
        return "";
      }
    },
  },
});
</script>
