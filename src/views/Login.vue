<template>
  <div class="flex justify-center items-center h-full">
    <div
      class="
        bg-white
        w-1/3
        shadow-md
        rounded
        px-8
        pt-6
        pb-8
        mb-4
        flex
        justify-center
        flex-col
      "
    >
      <div class="mb-4">
        <base-input
          id="email"
          v-model="email"
          type="email"
          label-text="email"
          placeholder="example@example.com"
        ></base-input>
      </div>
      <div class="mb-6">
        <base-input
          id="password"
          v-model="password"
          label-text="password"
          type="password"
          placeholder="******************"
        ></base-input>
      </div>
      <div class="flex items-center justify-between">
        <base-button @click="handleSubmit"> Sign In </base-button>
      </div>
    </div>
    <base-dialog :show="showError" title="Error" @close="showError = false">
      <template #body>
        <p>{{ errorMessage }}</p>
      </template>
      <template #footer>
        <base-button class="ml-2" @click="showError = false"> OK </base-button>
      </template>
    </base-dialog>
  </div>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import AuthService from "../services/AuthService";
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
    BaseDialog,
  },
  setup: () => {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const showError = ref(false);
    const errorMessage = ref<string>("");
    return {
      email,
      password,
      showError,
      errorMessage,
      async handleSubmit(e: Event) {
        e.preventDefault();
        try {
          const token = await AuthService.login({
            email: email.value,
            password: password.value,
          });
          if (token) router.push({ path: "media" });
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
