<template>
  <base-dialog :show="isOpen" title="Welcome" @close="isOpen = false">
    <template #body>
      <form>
        <div class="form-group">
          <base-input
            id="walletaddress"
            v-model="v$.walletAddress.$model"
            placeholder="Enter your Ripple Wallet Address"
            type="walletaddress"
            label-text="walletaddress"
            class="w-full max-w-xl"
            :is-required="v$.walletAddress.required"
            :is-invalid="v$.walletAddress.$dirty && v$.walletAddress.$invalid"
            :errors="formatVuelidateErrors(v$.walletAddress.$errors)"
          ></base-input>
        </div>
        <div class="form-group">
          <base-select
            id="type_networks"
            v-model="type_network"
            :choices="type_networks"
            type="type_networks"
            label-text="Type Networks"
            class="w-full max-w-xl"
          ></base-select>
        </div>
        <div v-if="type_network.value == 'test'" class="form-group">
          <base-select
            id="test_network"
            v-model="test_network"
            :choices="test_networks"
            label-text="Network"
            class="w-full max-w-xl"
          ></base-select>
        </div>
        <div v-else class="form-group">
          <base-select
            id="main_network"
            v-model="main_network"
            :choices="main_networks"
            label-text="Network"
            class="w-full max-w-xl"
          ></base-select>
        </div>
      </form>
    </template>
    <template #footer>
      <base-button
        status="success"
        class="mt-4"
        :disabled="v$.$invalid"
        @click="runAsyncFunction"
        >Enter
        <div
          v-if="isLoading"
          class="spinner-grow spinner-grow-sm"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </base-button>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import useVuelidate from "@vuelidate/core";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";

interface Choice {
  label: string;
  value: string;
}

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseSelect,
    BaseButton,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    asyncFun: {
      type: Function,
      required: true,
    },
  },
  async setup(props, { emit }) {
    const walletAddress = ref("");
    const isLoading = ref(false);
    const type_network = ref({ label: "Main", value: "main" });
    const type_networks = [
      { label: "Main", value: "main" },
      { label: "Test", value: "test" },
    ];
    const main_networks = [
      { label: "wss://xrpcluster.com", value: "wss://xrpcluster.com" },
      { label: "wss://xrpl.link", value: "wss://xrpl.link" },
      { label: "wss://s2.ripple.com", value: "wss://s2.ripple.com" },
    ];
    const test_networks = [
      {
        label: "wss://s.altnet.rippletest.net:51233",
        value: "wss://s.altnet.rippletest.net:51233",
      },
      {
        label: "wss://xrpl.linkwss://testnet.xrpl-labs.com",
        value: "wss://xrpl.linkwss://testnet.xrpl-labs.com",
      },
    ];

    const test_network = ref<Choice>(test_networks[0]);
    const main_network = ref<Choice>(main_networks[0]);

    const rules = computed(() => ({
      walletAddress: {
        required,
        isRippleAddress,
      },
    }));

    const v$ = useVuelidate(rules, {
      walletAddress,
    });

    return {
      main_networks,
      test_networks,
      test_network,
      main_network,
      v$,
      type_network,
      type_networks,
      isLoading,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      async runAsyncFunction() {
        await props.runAsyncFunction();
      },
    };
  },
});
</script>
