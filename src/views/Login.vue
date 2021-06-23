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
        <p class="text-red text-xs italic">Please choose a password.</p>
      </div>
      <div class="flex items-center justify-between">
        <base-button @click="handleSubmit"> Sign In </base-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import AuthService from "../services/AuthService";
import { ref, defineComponent } from "vue";
import router from "../router";
export default defineComponent({
  components: {
    BaseInput,
    BaseButton,
  },
  setup: () => {
    const email = ref("");
    const password = ref("");
    return {
      email,
      password,
      async handleSubmit(e: Event) {
        e.preventDefault();
        const token = await AuthService.login({
          email: email.value,
          password: password.value,
        });
        if (token) router.push({ path: "media" });
        console.log(token);
      },
    };
  },
});
</script>
