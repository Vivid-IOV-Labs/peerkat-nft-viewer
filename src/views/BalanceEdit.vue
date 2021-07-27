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
          readonly
        ></base-input>
      </div>
      <div>
        <base-input
          id="mediaID"
          v-model="data.formData.mediaID"
          label-text="mediaID"
          type="text"
          placeholder="Media ID"
          readonly
        ></base-input>
      </div>
      <div>
        <base-input
          id="balanceTotal"
          v-model="data.formData.balanceTotal"
          label-text="Balance Total"
          type="number"
          min="0"
          placeholder="balanceTotal"
          readonly
        ></base-input>
      </div>
      <div>
        <base-input
          id="balanceAvailable"
          v-model="data.formData.balanceAvailable"
          label-text="New Balance Available"
          type="number"
          min="0"
          placeholder="balanceAvailable"
        ></base-input>
      </div>
      <base-button class="w-full" @click="submit">Submit</base-button>
      <base-dialog
        :show="showSuccess"
        title="Success"
        @close="showSuccess = false"
      >
        <template #body>
          <p>Balance updated successfully</p>
        </template>
        <template #footer>
          <base-button class="ml-2" @click="pushToMediaList"> OK </base-button>
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
import BaseButton from "@/components/BaseButton.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import { defineComponent, reactive, ref } from "vue";
import MediaService from "../services/MediaService";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseDialog,
    ArrowLeftIcon,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const data = reactive<{ formData: any }>({
      formData: {
        mediaID: "",
        balanceAvailable: 0,
        balanceTotal: 0,
        details: {
          title: "",
        },
      },
    });
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
        try {
          const toUpdate = JSON.parse(JSON.stringify(data));

          const updatedMedia = {
            balanceAvailable: toUpdate.formData.balanceAvailable,
            mediaID: route.params.mediaID,
          };
          await MediaService.update(updatedMedia);
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
      pushToMediaList() {
        showSuccess.value = false;
        router.push({ path: "/media" });
      },
    };
  },
});
</script>
