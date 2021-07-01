<template>
  <div class="p-2">
    <router-link href="#" :to="{ path: '/media' }" class="block float-right">
      <ArrowLeftIcon class="h-8 w-8 text-gray-700" />
    </router-link>
    <hr class="clear-both my-6 border-none" />
    <form
      v-if="data.formData.details"
      class="w-full max-w-lg space-y-5 mx-auto"
    >
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
      <div>
        <base-input
          id="balanceTotal"
          v-model="data.formData.balanceTotal"
          label-text="balanceTotal"
          type="number"
          placeholder="balanceTotal"
        ></base-input>
      </div>
      <div>
        <base-input
          id="balanceAvailable"
          v-model="data.formData.balanceAvailable"
          label-text="balanceAvailable"
          type="number"
          placeholder="balanceAvailable"
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
      <base-button class="w-full" @click="submit">Submit</base-button>
      <base-dialog
        :show="showSuccess"
        title="Success"
        @close="showSuccess = false"
      >
        <template #body>
          <p>Media updated successfully</p>
        </template>
        <template #footer>
          <base-button class="ml-2" @click="showSuccess = false">
            OK
          </base-button>
        </template>
      </base-dialog>
      <base-dialog :show="showError" title="Error" @close="showError = false">
        <template #body>
          <p>{{ errorMessage }}</p>
        </template>
        <template #footer>
          <base-button class="ml-2" @click="showError = false">
            OK
          </base-button>
        </template>
      </base-dialog>
    </form>
  </div>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "../components/BaseButton.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import BaseDialog from "../components/BaseDialog.vue";
import { defineComponent, reactive, ref } from "vue";
import MediaService from "../services/MediaService";
import { useRoute } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseCheckbox,
    BaseDialog,
    ArrowLeftIcon,
  },
  setup() {
    const route = useRoute();
    const data = reactive({ formData: {} });
    const showError = ref(false);
    const errorMessage = ref<string>("");
    const showSuccess = ref(false);
    (async () => {
      if (route.params.mediaID) {
        data.formData = await MediaService.find(String(route.params.mediaID));
      }
    })();
    return {
      data,
      showSuccess,
      showError,
      errorMessage,
      async submit(event: Event) {
        event.preventDefault();
        console.log(data.formData.details);

        if (data.formData.details && data.formData.details.twitter.hashtags) {
          data.formData.details.twitter.hashtags =
            data.formData.details.twitter.hashtags.split(",");
        }
        console.log(data.formData);
        try {
          await MediaService.update(data.formData);
          showSuccess.value = true;
        } catch (error) {
          const {
            response: {
              data: { message },
            },
          } = error;
          errorMessage.value = String(message);
          showError.value = true;
        }
      },
    };
  },
});
</script>
