<template>
  <div class="rounded-lg border bg-white shadow-lg">
    <div class="w-full rounded-t-lg h-80 overflow-hidden">
      <img
        :class="{
          'object-contain': showQRCode && !invalidQR,
          'object-cover': !showQRCode || invalidQR,
        }"
        class="object-center h-full w-full"
        :src="showQRCode && !invalidQR ? xumnQRCode : posterUrl"
        @error="fallbackImg"
      />
    </div>
    <div class="flex justify-between h-12 p-3 items-center">
      <a
        v-if="showQRCode && !invalidQR"
        class="
          d-block
          bg-white
          border-2 border-red-600
          uppercase
          font-bold
          text-xs text-red-600
          py-1
          px-2
          rounded
        "
        target="_blank"
        :href="xumnLink"
        >Claim on Xumn App</a
      >
      <a
        v-if="showQRCode && !invalidQR"
        class="
          d-block
          bg-white
          border-2 border-red-600
          uppercase
          font-bold
          text-xs text-red-600
          py-1
          px-2
          rounded
          cursor-pointer
        "
        @click="showQRCode = false"
        >x</a
      >
      <a
        v-if="!showQRCode || invalidQR"
        class="
          d-block
          bg-white
          border-2 border-red-600
          uppercase
          font-bold
          text-xs text-red-600
          py-1
          px-2
          rounded
          cursor-pointer
        "
        @click="showQRCode = true"
      >
        <QrcodeIcon class="h-4 w-4 text-red-600" />
      </a>
    </div>
    <div class="w-full flex justify-between p-3">
      <div class="flex w-full flex-col justify-between">
        <span class="font-bold text-xl">{{ title }}</span>
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
import webSocket from "../utils/websocketAdaptor";
import { QrcodeIcon } from "@heroicons/vue/solid";

function getRole() {
  return localStorage.getItem("user-role");
}
function withRole(roles: string[]) {
  roles.includes(getRole() || "");
  return roles.includes(getRole() || "");
}
export default defineComponent({
  components: {
    BaseButton,
    BaseDialog,
    QrcodeIcon,
  },
  props: {
    nft: { type: Object as PropType<NFT>, required: true },
  },
  setup: (props) => {
    const store = useStore();
    const isDeleteDialogOpen = ref(false);
    const showQRCode = ref(false);
    const invalidQR = ref(false);
    if (
      props.nft.xumm &&
      props.nft.xumm.length &&
      props.nft.xumm[0].details.refs.qr_png
    ) {
      showQRCode.value = true;
    }
    if (showQRCode.value) {
      webSocket.socket.on("expired", (data) => {
        console.log("expired", data);
        invalidQR.value = true;
      });
      webSocket.socket.on("scanned", (data) => {
        console.log("scanned", data);
      });
      webSocket.socket.on("signed", (data) => {
        console.log("signed", data);
        invalidQR.value = true;
      });
      webSocket.socket.on("rejected", (data) => {
        console.log("rejected", data);
        invalidQR.value = true;
      });
    }

    return {
      isDeleteDialogOpen,
      showQRCode,
      invalidQR,
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
        withRole(["brand/worker"])
      );
    },
    canApprove(): boolean {
      return (
        ["created"].includes(this.nft.current_status) &&
        withRole(["brand/manager"])
      );
    },
    canReject(): boolean {
      return (
        ["created"].includes(this.nft.current_status) &&
        withRole(["admin/worker", "brand/manager"])
      );
    },
    canIssue(): boolean {
      return (
        ["approved"].includes(this.nft.current_status) &&
        withRole(["admin/worker"])
      );
    },
    canClaim(): boolean {
      return (
        ["issued"].includes(this.nft.current_status) && withRole(["public"])
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
