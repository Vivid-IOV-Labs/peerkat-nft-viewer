<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <slot></slot>
    <welcome
      :is-open="isDialogWalletConnection"
      :async-fun="populateNFTs"
    ></welcome>
    <base-dialog
      :show="showError"
      title="An Error occurs"
      @close="
        showError = false;
        isDialogWalletConnection = true;
      "
    >
      <template #body>
        <h3>{{ $t("Unable to connect") }}</h3>
        <p>{{ $t("Please try another network") }}</p>
      </template>
      <template #footer>
        <base-button
          class="mt-4"
          status="warning"
          @click="
            showError = false;
            isDialogWalletConnection = true;
          "
          >Ok
        </base-button>
      </template>
    </base-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import { useStore } from "vuex";
import Welcome from "@/dialogs/Welcome.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { Welcome },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const isInXumm = inject("isInXumm");
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
    // const walletAddress = computed(() => store.getters["user/getAddress"]);
    // const nodetype = computed(() => store.getters["user/getNodeType"]);
    const showError = ref(false);
    const isDialogWalletConnection = ref(false);
    function handleError(): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
    }
    const lines = computed(() => store.getters["nft/getLines"]);
    const populateNFTs = async () => {
      try {
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: walletAddress.value,
          nodetype: nodetype.value,
          handleError,
        });
        await store.dispatch("nft/fetchNext", nodetype.value);
        isDialogWalletConnection.value = false;
      } catch (err) {
        showError.value = true;
        isDialogWalletConnection.value = false;
      }
    };
    if (isInXumm) {
      await store.dispatch("xumm/getOttData");
      const ottdata = computed(() => store.getters["xumm/getOttData"]);
      store.commit("user/setAddress", ottdata.value.account);
      store.commit("user/setNodeType", ottdata.value.nodetype);
      const path = ottdata.value.redirect;
      if (path) {
        router.push({ path });
        return;
      }
      if (lines.value.length === 0) {
        await populateNFTs();
      }
    } else {
      //rMfVCZ6QcVsnkzdbTQhFr2idpcakgxeqEM MAINNET
      //reWmfYP8FbRyWWEEkhpKzCpEnksg4sAwx TESTNET
      // store.commit("user/setAddress", "reWmfYP8FbRyWWEEkhpKzCpEnksg4sAwx");
      // store.commit("user/setNodeType", "TESTNET");
      isDialogWalletConnection.value = true;
    }

    return { isDialogWalletConnection, showError, populateNFTs };
  },
});
</script>
