<template>
  <div class="p-2">
    <router-link href="#" :to="{ path: '/media' }" class="block float-right">
      <ArrowLeftIcon class="h-8 w-8 text-gray-700" />
    </router-link>
    <hr class="clear-both my-6 border-none" />
    <form class="w-full max-w-lg space-y-5 mx-auto">
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
      <div>
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
      <pre>{{ v$.walletAddress.$errors }}</pre>
      <div>
        <base-input
          id="moreInfo"
          v-model="v$.moreInfo.$model"
          label-text="moreInfo"
          type="text"
          placeholder="More Info"
          :errors="formatVuelidateErrors(v$.moreInfo.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="balanceTotal"
          v-model="v$.balanceTotal.$model"
          label-text="balanceTotal"
          type="number"
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
          placeholder="100"
          :errors="formatVuelidateErrors(v$.balanceAvailable.$errors)"
        ></base-input>
      </div>
      <div class="flex justify-between w-full">
        <base-checkbox
          id="earn"
          v-model="v$.earn.$model"
          text="Is earn"
          label-text="earn"
          :errors="formatVuelidateErrors(v$.earn.$errors)"
        ></base-checkbox>
      </div>
      <div class="flex justify-between w-full">
        <base-checkbox
          id="highlighted:highlighted.value"
          v-model="v$.highlighted.$model"
          text="Is highlighted"
          label-text="highlighted"
          :errors="formatVuelidateErrors(v$.highlighted.$errors)"
        ></base-checkbox>
        <base-input
          id="order"
          v-model="v$.order.$model"
          label-text="order"
          type="number"
          placeholder="Order"
          :errors="formatVuelidateErrors(v$.order.$errors)"
        ></base-input>
      </div>
      <div class="flex justify-between w-full">
        <base-input
          id="hashtags"
          v-model="v$.hashtags.$model"
          label-text="hashtags"
          type="text"
          placeholder="hashtags"
          :errors="
            v$.hashtags.$errors && formatVuelidateErrors(v$.hashtags.$errors)
          "
        ></base-input>
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
      <base-button class="w-full" @click="submit">Submit</base-button>
    </form>
  </div>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseDialog from "../components/BaseDialog.vue";
import { ref, defineComponent, computed, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
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
    const hashtags = ref("");
    const earn = ref(true);
    const highlighted = ref(true);
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
      order: { required },
      balanceTotal: { required },
      balanceAvailable: { required },
      hashtags: { required },
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
    });
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
          details: {
            title: title.value,
            subtitle: subtitle.value,
            moreInfo: moreInfo.value,
            twitter: {
              hashtags: hashtags.value.trim().split(","),
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
        router.push({ path: "/media" });
      },
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
    };
  },
});
</script>
