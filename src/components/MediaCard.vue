<template>
    <div class="rounded overflow-hidden border w-full  bg-white shadow-lg">
    <div class="w-full flex justify-between p-3">
      <div class="flex">
        <span class="pt-1 ml-2 font-bold text-lg">{{title}}</span>
      </div>
    </div>
    <img class="w-full bg-cover" :src="posterUrl">
    <div class="px-3 pb-2">
      <div class="pt-2 ">
        <span class="text-sm text-gray-400 font-medium">{{hashtags}}</span>
      </div>
      <div class="pt-1">
        <div class="mb-2">
           {{subtitle}}
        </div>
      </div>
        <div class="pt-1">
            <a  target="_blank" :href="moreInfo" class="mb-2">
            More Info
            </a>
      </div>
    </div>
  </div>
</template>
<script>
const imagesCDNUrl = import.meta.env.VITE_CDN_IMAGES_URL;

export default {
    props:{
        media:Object
    },
  computed: {
    mediaID() {
      return this.media.mediaID;
    },
    videoUrl() {
      const url = `${env.media_server}/${this.mediaID}.mp4`;
      return url;
    },
    hlsUrl() {
      const url = `${env.media_hls}/${this.mediaID}.m3u8`;
      return url;
    },
    posterUrl() {
      const url = `${imagesCDNUrl}/${this.media.mediaID}.png`;
      return url;
    },
    title() {
      if (
        this.media &&
        this.media.details &&
        this.media.details.title
      ) {
        return this.media.details.title;
      } else {
        return "";
      }
    },
    hashtags() {
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
    subtitle() {
      if (
        this.media &&
        this.media.details &&
        this.media.details.subtitle
      ) {
        return this.media.details.subtitle;
      } else {
        return "";
      }
    },
    moreInfo() {
      if (
        this.media &&
        this.media.details &&
        this.media.details.moreInfo
      ) {
        return this.media.details.moreInfo;
      } else {
        return "";
      }
    },
  }
}
</script>