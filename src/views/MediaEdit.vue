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
      <div v-if="data.formData.earn">
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
      <div v-if="data.formData.earn">
        <base-input
          id="moreInfo"
          v-model="data.formData.details.moreInfo"
          label-text="moreInfo"
          type="text"
          placeholder="More Info Link"
        ></base-input>
      </div>
      <div
        v-if="data.formData.list && !data.formData.earn"
        class="flex justify-between w-full"
      >
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
      <p>
        You should separate categories by "," with no space in between and
        outside <br />
        ES: "crypto,gaming,other"
      </p>
      <div>
        <base-input
          id="categories"
          v-model="data.formData.categories"
          label-text="categories"
          type="text"
          placeholder="categories"
        ></base-input>
      </div>
      <p>
        You should separate hashtags by "," with no space in between and outside
        <br />
        ES: "crypto,thundercore,twitter"
      </p>
      <div v-if="data.formData.details.twitter">
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
import BaseButton from "../components/BaseButton.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import BaseDialog from "../components/BaseDialog.vue";
import { defineComponent, reactive, ref } from "vue";
import MediaService from "../services/MediaService";
import { ArrowLeftIcon } from "@heroicons/vue/solid";
import { Media } from "../models/Media";
import { useRoute, useRouter } from "vue-router";

function formatArraysString(arrayString: string | string[]) {
  if (arrayString && arrayString.length) {
    if (Array.isArray(arrayString)) {
      return arrayString;
    } else {
      return arrayString.split(",");
    }
  } else {
    return [];
  }
}
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
    const router = useRouter();
    const data = reactive<{ formData: Media }>({
      formData: {
        earn: false,
        publisher: { walletAddress: "" },
        mediaID: "",
        list: { highlighted: false },
        categories: [],
        details: {
          title: "",
          twitter: {
            hashtags: [],
          },
        },
      },
    });
    const showError = ref(false);
    const errorMessage = ref<string>("");
    const showSuccess = ref(false);
    (async () => {
      if (route.params.mediaID) {
        data.formData = await MediaService.find(String(route.params.mediaID));
        data.formData.categories =
          data.formData.mediaCategories && data.formData.mediaCategories?.length
            ? data.formData.mediaCategories.map(({ name }) => name).join(",")
            : "";
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

          const updatedMedia: Media = {
            publisher: {
              walletAddress: toUpdate.formData.publisher.walletAddress,
            },
            mediaID: Array.isArray(route.params.mediaID)
              ? route.params.mediaID.join("")
              : route.params.mediaID,
            list: {
              highlighted: toUpdate.formData.list.highlighted,
              order: toUpdate.formData.list.order,
            },
            categories: formatArraysString(toUpdate.formData.categories),
            details: {
              title: toUpdate.formData.details.title,
              subtitle: toUpdate.formData.details.subtitle || "",
              moreInfo: toUpdate.formData.details.moreInfo || "",
              twitter: {
                hashtags: formatArraysString(
                  toUpdate.formData.details.twitter.hashtags
                ),
              },
            },
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
