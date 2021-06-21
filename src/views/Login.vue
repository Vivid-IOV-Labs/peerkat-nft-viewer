<template>
<div class="flex justify-center items-center h-full">
  <div class="bg-white w-1/3 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex justify-center flex-col">
      <div class="mb-4">
        <base-input id="email" labelText="email" v-model="email"></base-input>
      </div>
      <div class="mb-6">
        <base-input id="password" labelText="password" v-model="password" type="password" placeholder="******************"></base-input>
        <p class="text-red text-xs italic">Please choose a password.</p>
      </div>
      <div class="flex items-center justify-between">
        <base-button @click="handleSubmit" >
          Sign In
        </base-button>
        <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
          Forgot Password?
        </a>
      </div>
  </div>
</div>

</template>

<script lang="ts">
// {
//     "email": "peerkatlive@gmail.com",
//     "password": "=C8N$Q!s&x9ne4KY"
// }
// https://vivid-media-test.herokuapp.com/admin/login
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'Login',
  components: {
    BaseInput,
    BaseButton
  },
  setup: () => {
  const email = ref("");
  const password = ref("");
        return {
      email,
      password,
      handleSubmit(e:Event) {
        e.preventDefault()
        console.log("submit", email.value, password.value);
      },
    };
  }
  
})
</script>