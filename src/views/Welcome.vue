<template>
  <div class="card" style="width: 60%; margin: 1rem auto; padding: 1rem">
    <form>
      <div class="form-group">
        <base-input
          id="user"
          v-model="v$.user.$model"
          placeholder="A user ID"
          label-text="User"
          class="w-full max-w-xl"
          :is-required="v$.user.required"
          :is-invalid="v$.user.$dirty && v$.user.$invalid"
          :errors="formatVuelidateErrors(v$.user.$errors)"
        ></base-input>
      </div>
      <div class="form-group">
        <base-input
          id="walletaddress"
          v-model="v$.walletAddress.$model"
          placeholder="Enter your Ripple Wallet Address"
          label-text="Walletaddress"
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
          label-text="Network Type"
          class="w-full max-w-xl"
        ></base-select>
      </div>

      <div class="form-group">
        {{ network }}
        <base-select
          id="network"
          v-model="network"
          :choices="networks"
          type="networks"
          :as-val="true"
          label-text="Network Url"
          class="w-full max-w-xl"
        ></base-select>
      </div>
    </form>
    <base-button
      status="success"
      class="mt-4"
      :disabled="v$.$invalid || isLoading"
      @click="runAsyncFunction"
      >Enter
      <div v-if="isLoading" class="spinner-grow spinner-grow-sm" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </base-button>
  </div>
  <base-dialog
    :show="showError"
    title="An Error occurs"
    @close="showError = false"
  >
    <template #body>
      <h3>{{ $t("Unable to connect") }}</h3>
      <p>{{ $t("Please try another network") }}</p>
    </template>
    <template #footer>
      <base-button class="mt-4" status="warning" @click="showError = false"
        >Ok
      </base-button>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import useVuelidate from "@vuelidate/core";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import BaseDialog from "@/components/BaseDialog.vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  components: {
    BaseInput,
    BaseSelect,
    BaseButton,
    BaseDialog,
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
  async setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(false);
    const showError = ref(false);
    const nodetypes = [
      { label: "Main", value: "MAINNET" },
      { label: "Test", value: "TESTNET" },
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
    const networks = computed(() => {
      return nodetype.value == "MAINNET" ? main_networks : test_networks;
    });

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
    const network = computed({
      get(): string {
        return store.getters["user/getNetwork"];
      },
      set(val: string): void {
        store.commit("user/setNetwork", val);
      },
    });
    const user = computed({
      get(): string {
        return store.getters["user/getUser"];
      },
      set(val: string): void {
        store.commit("user/setUser", val);
      },
    });
    const shared = computed(() =>
      store.getters["nft/getShared"](nodetype.value)
    );

    const rules = computed(() => ({
      walletAddress: {
        required,
        // isRippleAddress,
      },
      user: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, {
      walletAddress,
      user,
    });
    const connectXrpClient = async () => {
      try {
        if (!shared.value) {
          store.commit("nft/initSharedStore", user.value);
        }
        store.commit("nft/resetAll");
        await store.dispatch("nft/initXrpClient", {
          nodetype: nodetype.value,
        });
      } catch (err) {
        showError.value = true;
      }
    };

    return {
      v$,
      nodetypes,
      nodetype,
      isLoading,
      showError,
      network,
      networks,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      async runAsyncFunction() {
        isLoading.value = true;
        await connectXrpClient();
        isLoading.value = false;
        const path = route.params.redirect ? `/${route.params.redirect}` : "/";
        router.push({
          path,
        });
      },
    };
  },
});
</script>
