<template>
  <HeaderNavigation style="height: 15%" />
  <main style="height: 85%" class="container-fluid">
    <slot></slot>
  </main>
  <welcome
    :is-open="isDialogWalletConnection"
    :async-fun="connectXrpClient"
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
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import { useStore } from "vuex";
import Welcome from "@/dialogs/Welcome.vue";
import HeaderNavigation from "@/components/HeaderNavigation.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    HeaderNavigation,
    Welcome,
    BaseDialog,
    BaseButton,
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const isInXumm = inject("isInXumm");
    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const nodetype = computed(() => store.getters["user/getNodeType"]);
    const showError = ref(false);
    const isDialogWalletConnection = ref(false);

    function handleError(): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
    }
    const connectXrpClient = async () => {
      try {
        await store.dispatch("nft/initXrpClient", {
          nodetype: nodetype.value,
          handleError,
        });
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
      }
      await connectXrpClient();
    } else {
      if (!walletAddress.value) {
        isDialogWalletConnection.value = true;
      } else {
        await connectXrpClient();
      }
    }

    return { isDialogWalletConnection, showError, connectXrpClient };
  },
});
</script>
