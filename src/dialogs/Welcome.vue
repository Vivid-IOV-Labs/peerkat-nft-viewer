<template>
  <base-dialog :show="isOpen" title="Welcome">
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
            id="nodetypes"
            v-model="nodetype"
            :choices="nodetypes"
            type="nodetypes"
            :as-val="true"
            label-text="Type Networks"
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
import { useStore } from "vuex";

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
    const store = useStore();
    const isLoading = ref(false);
    const nodetypes = [
      { label: "Main", value: "MAINNET" },
      { label: "Test", value: "TESTNET" },
    ];
    // const main_networks = [
    //   { label: "wss://xrpcluster.com", value: "wss://xrpcluster.com" },
    //   { label: "wss://xrpl.link", value: "wss://xrpl.link" },
    //   { label: "wss://s2.ripple.com", value: "wss://s2.ripple.com" },
    // ];
    // const test_networks = [
    //   {
    //     label: "wss://s.altnet.rippletest.net:51233",
    //     value: "wss://s.altnet.rippletest.net:51233",
    //   },
    //   {
    //     label: "wss://xrpl.linkwss://testnet.xrpl-labs.com",
    //     value: "wss://xrpl.linkwss://testnet.xrpl-labs.com",
    //   },
    // ];
    const walletAddress = computed({
      get(): string {
        return store.getters["user/getAddress"];
      },
      set(val: string): void {
        store.commit("user/setAddress", val);
      },
    });
    const nodetype = computed({
      get(): string {
        return store.getters["user/getNodeType"];
      },
      set(val: string): void {
        store.commit("user/setNodeType", val);
      },
    });
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
      v$,
      nodetypes,
      nodetype,
      isLoading,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      async runAsyncFunction() {
        isLoading.value = true;
        await props.asyncFun();
        isLoading.value = false;
      },
    };
  },
});
</script>
