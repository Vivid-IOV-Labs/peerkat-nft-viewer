<template>
  <HeaderNavigation style="height: 15%" />
  <main style="height: 85%" class="container-fluid">
    <slot></slot>
  </main>
  <!-- <welcome
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
  </base-dialog> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderNavigation from "@/components/HeaderNavigation.vue";

export default defineComponent({
  components: {
    HeaderNavigation,
  },
});
</script>
