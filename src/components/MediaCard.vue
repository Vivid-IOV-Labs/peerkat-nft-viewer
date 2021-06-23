<template>
  <div class="rounded overflow-hidden border w-full bg-white shadow-lg">
    <div class="w-full flex justify-between p-3">
      <div class="flex">
        <span class="pt-1 ml-2 font-bold text-xl">{{ title }}</span>
      </div>
    </div>
    <figure class="w-full h-22">
      <img class="w-full object-cover object-centerz" :src="posterUrl" />
    </figure>
    <div class="px-3 pb-2">
      <div class="pt-2">
        <span class="text-sm text-gray-400 font-medium">{{ hashtags }}</span>
      </div>
      <div class="pt-1">
        <div class="mb-2">
          {{ subtitle }}
        </div>
      </div>
      <div class="pt-1">
        <a target="_blank" :href="moreInfo" class="mb-2"> More Info </a>
      </div>
    </div>
    <div class="border-t-2 p-4 flex justify-end">
      <base-button>Edit</base-button>
      <base-button @click="confirmDelete">Delete</base-button>
    </div>
    <base-dialog
      v-model="isDeleteDialogOpen"
      :on-close="deleteMedia"
    ></base-dialog>
  </div>
</template>
<script lang="ts">
const imagesCDNUrl = import.meta.env.VITE_CDN_IMAGES_URL;
import BaseButton from "../components/BaseButton.vue";
import BaseDialog from "../components/BaseDialog.vue";
import { PropType } from "vue";
import { Media } from "../models/Media";
import MediaService from "../services/MediaService";

export default {
  components: {
    BaseButton,
    BaseDialog,
  },
  props: {
    media: { type: Object as PropType<Media>, required: true },
  },
  data: function (): Record<string, unknown> {
    return {
      isDeleteDialogOpen: false,
    };
  },
  computed: {
    mediaID(): string {
      return this.media.mediaID;
    },
    // videoUrl() {
    //   const url = `${env.media_server}/${this.mediaID}.mp4`;
    //   return url;
    // },
    // hlsUrl() {
    //   const url = `${env.media_hls}/${this.mediaID}.m3u8`;
    //   return url;
    // },
    posterUrl(): string {
      const url = `${imagesCDNUrl}/${this.media.mediaID}.png`;
      return url;
    },
    title(): string {
      if (this.media && this.media.details && this.media.details.title) {
        return this.media.details.title;
      } else {
        return "";
      }
    },
    hashtags(): string {
      if (
        this.media &&
        this.media.details &&
        this.media.details.twitter &&
        this.media.details.twitter.hashtags
      ) {
        return this.media.details.twitter.hashtags
          .reduce((acc, tag) => {
            acc += ` #${tag},`;
            return acc;
          }, "")
          .slice(1, -1);
      } else {
        return "";
      }
    },
    subtitle(): string {
      if (this.media && this.media.details && this.media.details.subtitle) {
        return this.media.details.subtitle;
      } else {
        return "";
      }
    },
    moreInfo(): string {
      if (this.media && this.media.details && this.media.details.moreInfo) {
        return this.media.details.moreInfo;
      } else {
        return "";
      }
    },
  },
  methods: {
    confirmDelete(): void {
      this.isDeleteDialogOpen = true;
    },
    async deleteMedia(): Promise<void> {
      console.log(this.mediaID);
      await MediaService.remove(this.mediaID);
    },
  },
};
</script>
