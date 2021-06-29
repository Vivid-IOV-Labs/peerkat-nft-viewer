<template>
  <form class="w-full max-w-lg space-y-5 mx-auto">
    <h1>Add New media</h1>
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
        :errors="formatVuelidateErrors(v$.hashtags.$errors)"
      ></base-input>
    </div>
    <base-button class="w-full" @click="submit">Submit</base-button>
  </form>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import { ref, defineComponent, computed, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";

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
    BaseButton,
    BaseCheckbox,
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
    const order = ref(0);

    const rules = computed(() => ({
      title: { required },
      subtitle: {},
      walletAddress: { required },
      mediaID: { required },
      moreInfo: { url },
      earn: { required },
      highlighted: { required },
      order: { required },
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
      hashtags,
      v$,
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
        await store.dispatch("media/add", newMedia);
        router.push({ path: "/media" });
      },
      formatVuelidateErrors(errors: Array<ErrorObject>) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
    };
  },
});
</script>
