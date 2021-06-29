<template>
  <form v-if="data.formData.details" class="w-full max-w-lg space-y-5 mx-auto">
    <h1>Edit</h1>
    <div>
      <base-input
        id="title"
        v-model="data.formData.details.title"
        label-text="title"
        type="text"
        placeholder="Title"
      ></base-input>
    </div>
    <div>
      <base-input
        id="subtitle"
        v-model="data.formData.details.subtitle"
        label-text="subtitle"
        type="text"
        placeholder="Subtitile"
      ></base-input>
    </div>
    <div>
      <base-input
        id="mediaID"
        v-model="data.formData.mediaID"
        label-text="mediaID"
        type="text"
        placeholder="Media ID"
      ></base-input>
    </div>
    <div>
      <base-input
        id="walletAddress"
        v-model="data.formData.publisher.walletAddress"
        label-text="walletAddress"
        type="text"
        placeholder="Publisher walletAddress"
      ></base-input>
    </div>
    <div>
      <base-input
        id="moreInfo"
        v-model="data.formData.details.moreInfo"
        label-text="moreInfo"
        type="text"
        placeholder="More Info"
      ></base-input>
    </div>
    <div class="flex justify-between w-full">
      <base-checkbox
        id="earn"
        v-model="data.formData.earn"
        text="Is earn"
        label-text="earn"
      ></base-checkbox>
    </div>
    <div v-if="data.formData.list" class="flex justify-between w-full">
      <base-checkbox
        id="highlighted"
        v-model="data.formData.list.highlighted"
        text="Is highlighted"
        label-text="highlighted"
      ></base-checkbox>
      <base-input
        id="order"
        v-model="data.formData.list.order"
        label-text="order"
        type="number"
        placeholder="Order"
      ></base-input>
    </div>
    <div class="flex justify-between w-full">
      <base-input
        id="hashtags"
        v-model="data.formData.details.twitter.hashtags"
        label-text="hashtags"
        type="text"
        placeholder="hashtags"
      ></base-input>
    </div>
    <base-button @click="submit">Submit</base-button>
  </form>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import { defineComponent, reactive } from "vue";
import MediaService from "../services/MediaService";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseCheckbox,
  },
  setup() {
    const route = useRoute();
    const data = reactive({ formData: {} });
    (async () => {
      if (route.params.mediaID) {
        data.formData = await MediaService.find(String(route.params.mediaID));
      }
    })();
    return {
      data,
      async submit(event: Event) {
        event.preventDefault();
        await MediaService.update(data.formData);
      },
    };
  },
});
</script>
