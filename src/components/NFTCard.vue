<template>
  <div class="rounded-lg border bg-white shadow-lg">
    <div class="w-full rounded-t-lg h-96 overflow-hidden relative">
      <base-button
        v-if="showQRCode"
        class="absolute top-2 right-1"
        @click="showQRCode = false"
        >x</base-button
      >
      <img
        class="object-cover object-center h-full w-full"
        :src="showQRCode ? xumnQRCode : posterUrl"
        @error="fallbackImg"
      />
      <div class="pt-1">
        <a
          v-if="showQRCode"
          class="
            absolute
            bottom-0
            right-0
            d-block
            bg-white
            uppercase
            font-bold
            text-xs
            py-4
            px-6
          "
          target="_blank"
          :href="xumnLink"
          >Claim on Xumn App</a
        >
      </div>
    </div>
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
    <div class="px-3 pb-2 h-20 overflow-y-auto">
      <div class="pt-2">
        <span class="text-sm text-gray-400 font-medium"
          >Categories: {{ categories }}</span
        >
      </div>
      <div class="pt-2">
        <span class="text-sm text-gray-400 font-medium">Tags:{{ tags }}</span>
      </div>
    </div>
    <div class="border-t-2 p-4 flex justify-end">
      <base-button v-if="canDelete" class="mr-2" @click="deleteNFT"
        >Delete</base-button
      >
      <base-button v-if="canApprove" class="mr-2" @click="approveNFT"
        >Approve</base-button
      >
      <base-button v-if="canIssue" class="mr-2" @click="issueNFT"
        >Issue</base-button
      >
      <base-button v-if="canClaim" class="mr-2" @click="claimNFT"
        >Claim</base-button
      >
      <base-button v-if="canReject" class="mr-2" @click="deleteNFT"
        >Reject</base-button
      >
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
    const isDeleteDialogOpen = ref(false);
    const showQRCode = ref(false);
    if (
      props.nft.xumm &&
      props.nft.xumm.length &&
      props.nft.xumm[0].details.refs.qr_png
    ) {
      showQRCode.value = true;
    }
    return {
      isDeleteDialogOpen,
      showQRCode,
      fallbackImg(event: Event): void {
        (event.target as HTMLImageElement).src = "thumbnail.jpg";
      },
      deleteNFT(): void {
        isDeleteDialogOpen.value = true;
        console.log(213);
      },
      approveNFT(): void {
        store.dispatch("nft/approve", props.nft);
      },
      issueNFT(): void {
        store.dispatch("nft/issue", props.nft);
      },
      async claimNFT(): Promise<void> {
        await store.dispatch("nft/claim", props.nft);
        showQRCode.value = true;
      },
    };
  },
  computed: {
    canDelete(): boolean {
      return (
        ["created", "rejected"].includes(this.nft.current_status) &&
        ["brand/worker"].includes(localStorage.getItem("user-role") || "")
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
        ["admin/worker", "brand/manager"].includes(
          localStorage.getItem("user-role") || ""
        )
      );
    },
    canIssue(): boolean {
      return (
        ["approved"].includes(this.nft.current_status) &&
        localStorage.getItem("user-role") == "admin/worker"
      );
    },
    canClaim(): boolean {
      return (
        ["issued"].includes(this.nft.current_status) &&
        localStorage.getItem("user-role") == "public"
      );
    },
    xumnQRCode(): string {
      const { length, [length - 1]: last } = this.nft.xumm;
      return length ? last.details.refs.qr_png : "";
    },
    xumnLink(): string {
      const { length, [length - 1]: last } = this.nft.xumm;
      return length ? last.details.next.always : "";
    },
    tokenName(): string {
      return this.nft.details.token_name;
    },
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
