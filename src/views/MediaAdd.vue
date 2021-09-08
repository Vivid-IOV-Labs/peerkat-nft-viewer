<template>
  <div class="p-2">
    <a href="#" class="block float-right" @click="pushToMediaList">
      <ArrowLeftIcon class="h-8 w-8 text-gray-700" />
    </a>
    <hr class="clear-both my-6 border-none" />
    <form class="w-full max-w-lg space-y-5 mx-auto">
      <div class="flex justify-between w-full items-start">
        <base-checkbox
          id="earn"
          v-model="v$.earn.$model"
          text="Is earn"
          label-text="earn"
          :errors="formatVuelidateErrors(v$.earn.$errors)"
          @change="onEarnChange"
        ></base-checkbox>
        <div v-if="v$.earn.$model">
          <div>
            <base-input
              id="balanceTotal"
              v-model="v$.balanceTotal.$model"
              label-text="balanceTotal"
              type="number"
              min="0"
              placeholder="100"
              :errors="formatVuelidateErrors(v$.balanceTotal.$errors)"
            ></base-input>
          </div>
          <div>
            <base-input
              id="balanceAvailable"
              v-model="v$.balanceAvailable.$model"
              label-text="balanceAvailable"
              type="number"
              min="0"
              placeholder="100"
              :errors="formatVuelidateErrors(v$.balanceAvailable.$errors)"
            ></base-input>
          </div>
        </div>
      </div>
      <div>
        <base-input
          id="title"
          v-model="v$.title.$model"
          label-text="title"
          type="text"
          placeholder="Title"
          :errors="formatVuelidateErrors(v$.title.$errors)"
        ></base-input>
      </div>
      <div v-if="v$.earn.$model">
        <base-input
          id="subtitle"
          v-model="v$.subtitle.$model"
          label-text="subtitle"
          type="text"
          placeholder="Subtitile"
          :errors="formatVuelidateErrors(v$.subtitle.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="mediaID"
          v-model="v$.mediaID.$model"
          label-text="mediaID"
          type="text"
          placeholder="Media ID"
          :errors="formatVuelidateErrors(v$.mediaID.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="walletAddress"
          v-model="v$.walletAddress.$model"
          label-text="walletAddress"
          type="text"
          placeholder="Publisher walletAddress"
          :errors="formatVuelidateErrors(v$.walletAddress.$errors)"
        ></base-input>
      </div>
      <div v-if="v$.earn.$model">
        <base-input
          id="moreInfo"
          v-model="v$.moreInfo.$model"
          label-text="moreInfo"
          type="text"
          placeholder="More Info Link"
          :errors="formatVuelidateErrors(v$.moreInfo.$errors)"
        ></base-input>
      </div>
      <div
        v-if="!v$.earn.$model"
        class="flex justify-between w-full items-start"
      >
        <base-checkbox
          id="highlighted:highlighted.value"
          v-model="v$.highlighted.$model"
          text="Is highlighted"
          label-text="highlighted"
          :errors="formatVuelidateErrors(v$.highlighted.$errors)"
        ></base-checkbox>
        <div v-if="v$.highlighted.$model">
          <base-input
            id="order"
            v-model="v$.order.$model"
            label-text="order"
            type="number"
            placeholder="Order"
            min="0"
            :errors="formatVuelidateErrors(v$.order.$errors)"
          ></base-input>
        </div>
      </div>
      <div>
        <base-multi-select
          v-model="v$.categories.$model"
          name="categories"
          label-text="categories"
          label="value"
          :options="categoriesOptions"
          :errors="
            v$.categories.$errors &&
            formatVuelidateErrors(v$.categories.$errors)
          "
        ></base-multi-select>
      </div>
      <div>
        <base-multi-select
          v-model="v$.hashtags.$model"
          name="hashtags"
          label-text="hashtags"
          :errors="
            v$.hashtags.$errors && formatVuelidateErrors(v$.hashtags.$errors)
          "
        ></base-multi-select>
      </div>
      <base-dialog
        :show="showSuccess"
        title="Success"
        @close="showSuccess = false"
      >
        <template #body>
          <p>Media added successfully</p>
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
      <base-button :disabled="v$.$invalid" class="w-full" @click="submit"
        >Submit</base-button
      >
    </form>
  </div>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseMultiSelect from "@/components/BaseMultiSelect.vue";
import { ref, defineComponent, computed, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, url, minValue } from "@vuelidate/validators";
import { isAddress } from "../utils/validators";
import { ArrowLeftIcon } from "@heroicons/vue/solid";

export interface ErrorObject {
  $propertyPath: string;
  $property: string;
  $validator: string;
  $message: string | Ref<string>;
  $params: Record<string, unknown>;
  $pending: boolean;
  $response: unknown;
  $uid: string;
}
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

interface ProxyArray<T> extends Array<T> {
  handler(): Array<T>;
  target(value: T): void;
}

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

type ProxifyArray<T> = {
  [P in keyof T]: ProxyArray<T[P]>;
};
type ArrayErrors = ProxifyArray<ErrorObject>;

export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseCheckbox,
    BaseDialog,
    BaseMultiSelect,
    ArrowLeftIcon,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const title = ref("");
    const subtitle = ref("");
    const walletAddress = ref("");
    const mediaID = ref("");
    const moreInfo = ref("");
    const hashtags = ref([]);
    const categories = ref([]);
    const earn = ref(false);
    const highlighted = ref(false);
    const order = ref<number>(0);
    const balanceTotal = ref<number>(0);
    const balanceAvailable = ref<number>(0);
    const showError = ref(false);
    const errorMessage = ref<string>("");
    const showSuccess = ref(false);

    const rules = computed(() => ({
      title: { required },
      subtitle: {},
      walletAddress: {
        required,
        isAddress,
      },
      mediaID: { required },
      moreInfo: { url },
      earn: { required },
      highlighted: { required },
      order: { required, minValue: minValue(0) },
      balanceTotal: { required, minValue: minValue(0) },
      balanceAvailable: { required, minValue: minValue(0) },
      hashtags: { required },
      categories: { required },
    }));
    const v$ = useVuelidate(rules, {
      title,
      subtitle,
      mediaID,
      walletAddress,
      earn,
      highlighted,
      moreInfo,
      order,
      hashtags,
      balanceTotal,
      balanceAvailable,
      categories,
    });
    const categoriesOptions = [
      { label: "Crypto", value: "crypto" },
      { label: "Gaming", value: "gaming" },
      { label: "Other", value: "other " },
    ];
    return {
      title,
      subtitle,
      mediaID,
      walletAddress,
      earn,
      highlighted,
      moreInfo,
      order,
      balanceTotal,
      balanceAvailable,
      hashtags,
      v$,
      showError,
      showSuccess,
      errorMessage,
      categoriesOptions,
      async submit(event: Event) {
        event.preventDefault();
        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return;
        const newMedia = {
          type: "video",
          earn: earn.value,
          publisher: {
            walletAddress: walletAddress.value,
          },
          balanceAvailable: balanceAvailable.value,
          balanceTotal: balanceTotal.value,
          mediaID: mediaID.value,
          list: {
            highlighted: highlighted.value,
            order: order.value,
          },
          categories: categories.value,
          details: {
            title: title.value,
            subtitle: subtitle.value,
            moreInfo: moreInfo.value,
            twitter: {
              hashtags: hashtags.value,
            },
          },
        };
        try {
          await store.dispatch("media/add", newMedia);
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
        router.go(-1);
      },
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      onEarnChange(event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        highlighted.value = isChecked ? false : highlighted.value;
      },
    };
  },
});
</script>
