<template>
  <div class="p-2">
    <a href="#" class="block float-right" @click="pushToMediaList">
      <ArrowLeftIcon class="h-8 w-8 text-gray-700" />
    </a>
    <hr class="clear-both my-6 border-none" />
    <form class="w-full max-w-lg space-y-5 mx-auto">
      <div>
        <base-input
          id="token_name"
          v-model="formData.token_name"
          label-text="token_name"
          type="text"
          placeholder="Media ID"
          :errors="formatVuelidateErrors(v$.token_name.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="title"
          v-model="formData.title"
          label-text="title"
          type="text"
          placeholder="Title"
          :errors="formatVuelidateErrors(v$.title.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="subtitle"
          v-model="formData.subtitle"
          label-text="subtitle"
          type="text"
          placeholder="subtitle"
          :errors="formatVuelidateErrors(v$.subtitle.$errors)"
        ></base-input>
      </div>
      <div>
        <base-input
          id="mediaurl"
          v-model="formData.mediaurl"
          label-text="mediaurl"
          type="text"
          placeholder="mediaurl"
          :errors="formatVuelidateErrors(v$.mediaurl.$errors)"
        ></base-input>
      </div>
      <div>
        <base-text-area
          id="description"
          v-model="formData.description"
          label-text="description"
          placeholder="Publisher description"
          :errors="formatVuelidateErrors(v$.description.$errors)"
        ></base-text-area>
      </div>
      <div>
        <base-input
          id="brand_name"
          v-model="formData.brand_name"
          label-text="brand_name"
          type="text"
          placeholder="brand_name"
          :errors="formatVuelidateErrors(v$.brand_name.$errors)"
        ></base-input>
      </div>
      <div>
        <base-multi-select
          v-model="formData.categories"
          name="categories"
          label-text="categories"
          label="value"
          :errors="
            v$.categories.$errors &&
            formatVuelidateErrors(v$.categories.$errors)
          "
        ></base-multi-select>
      </div>
      <div>
        <base-multi-select
          v-model="formData.tags"
          name="tags"
          label-text="tags"
          :errors="v$.tags.$errors && formatVuelidateErrors(v$.tags.$errors)"
        ></base-multi-select>
      </div>
      <div>
        <base-checkbox
          id="transferable_copyright"
          v-model="formData.transferable_copyright"
          text="Is transferable_copyright"
          label-text="transferable_copyright"
          :errors="
            v$.transferable_copyright.$errors &&
            formatVuelidateErrors(v$.transferable_copyright.$errors)
          "
        ></base-checkbox>
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
import BaseTextArea from "@/components/BaseTextArea.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseMultiSelect from "@/components/BaseMultiSelect.vue";
import { reactive, defineComponent, computed, ref, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, url, maxLength } from "@vuelidate/validators";
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

export default defineComponent({
  components: {
    BaseInput,
    BaseTextArea,
    BaseButton,
    BaseCheckbox,
    BaseDialog,
    BaseMultiSelect,
    ArrowLeftIcon,
  },
  setup: () => {
    const store = useStore();
    const router = useRouter();

    const formData = reactive({
      token_name: "",
      title: "",
      subtitle: "",
      description: "",
      tags: [],
      mediaurl: "",
      categories: [],
      brand_name: "",
      transferable_copyright: false,
      status: "",
    });
    const showError = ref(false);
    const errorMessage = ref<string>("");
    const showSuccess = ref(false);
    // brand/manager brand/worker
    const rules = computed(() => ({
      title: { required },
      token_name: { required, maxLength: maxLength(40) }, //max 40 chatracters
      subtitle: {},
      description: {},
      brand_name: {
        required,
      },
      transferable_copyright: { required },
      mediaurl: { required, url },
      tags: { required },
      categories: { required },
    }));
    const v$ = useVuelidate(rules, formData, { $autoDirty: true });
    return {
      formData,
      v$,
      showError,
      showSuccess,
      errorMessage,
      async submit(event: Event) {
        event.preventDefault();
        const isFormCorrect = await v$.value.$validate();
        debugger;
        if (!isFormCorrect) return;
        try {
          await store.dispatch("nft/create", formData);
          showSuccess.value = true;
        } catch (error) {
          console.log(error);
          // errorMessage.value = String(message);
          // showError.value = true;
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
    };
  },
});
</script>
