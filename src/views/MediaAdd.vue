<template>
  <form class="w-full max-w-lg space-y-5 mx-auto">
    <h1>Add New media</h1>
    <div>
      <base-input
        id="title"
        v-model="title"
        label-text="title"
        type="text"
        placeholder="Title"
      ></base-input>
    </div>
    <div>
      <base-input
        id="subtitle"
        v-model="subtitle"
        label-text="subtitle"
        type="text"
        placeholder="Subtitile"
      ></base-input>
    </div>
    <div>
      <base-input
        id="mediaID"
        v-model="mediaID"
        label-text="mediaID"
        type="text"
        placeholder="Media ID"
      ></base-input>
    </div>
    <div>
      <base-input
        id="walletAddress"
        v-model="walletAddress"
        label-text="walletAddress"
        type="text"
        placeholder="Publisher walletAddress"
      ></base-input>
    </div>
    <div>
      <base-input
        id="moreInfo"
        v-model="moreInfo"
        label-text="moreInfo"
        type="text"
        placeholder="More Info"
      ></base-input>
    </div>
    <div class="flex justify-between w-full">
      <base-checkbox
        id="earn"
        v-model="earn"
        text="Is earn"
        label-text="earn"
      ></base-checkbox>
      <base-checkbox
        id="live"
        v-model="live"
        text="Is live"
        label-text="live"
      ></base-checkbox>
    </div>
    <div class="flex justify-between w-full">
      <base-checkbox
        id="highlighted:highlighted.value"
        v-model="highlighted"
        text="Is highlighted"
        label-text="highlighted"
      ></base-checkbox>
      <base-input
        id="order"
        v-model="order"
        label-text="order"
        type="number"
        placeholder="Order"
      ></base-input>
    </div>
    <div class="flex justify-between w-full">
      <base-input
        id="hashtags"
        v-model="hashtags"
        label-text="hashtags"
        type="text"
        placeholder="hashtags"
      ></base-input>
    </div>
    <base-button @click="submit">Submit</base-button>

    <pre>{{ newMedia }}</pre>
  </form>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import { ref, defineComponent } from "vue";
import MediaService from "../services/MediaService";

export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseCheckbox,
  },
  setup: () => {
    const title = ref("");
    const subtitle = ref("");
    const walletAddress = ref("");
    const mediaID = ref("");
    const moreInfo = ref("");
    const hashtags = ref("");
    const live = ref(true);
    const earn = ref(true);
    const highlighted = ref(true);
    const order = ref(0);
    return {
      title,
      subtitle,
      mediaID,
      walletAddress,
      live,
      earn,
      highlighted,
      moreInfo,
      order,
      hashtags,
      change(e: Event) {
        e.preventDefault();
        console.log(e);
      },
      async submit(event: Event) {
        event.preventDefault();
        const newMedia = {
          type: "video",
          live: live.value,
          earn: earn.value,
          publisher: {
            walletAddress: walletAddress.value,
          },
          mediaID: mediaID.value,
          list: {
            highlighted: highlighted.value,
            order: order.value,
          },
          details: {
            title: title.value,
            subtitle: subtitle.value,
            moreInfo: moreInfo.value,
            twitter: {
              hashtags: hashtags.value,
            },
          },
        };
        await MediaService.add(newMedia);
      },
    };
  },
  data: function () {
    return {
      lice: true,
    };
  },
});
</script>
