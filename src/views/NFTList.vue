<template>
  <div class="container">
    <div class="flex flex-col justify-center items-center mb-2">
      <h2>
        <span>{{ $t("welcome") }}</span>
      </h2>
      <hr />
    </div>
    <div v-if="NFTMedia.length" class="row">
      <div
        v-for="nft in NFTMedia"
        :key="nft.issuer"
        class="col-sm-12 col-lg-4 pb-4"
      >
        <nft-card :nft="nft"></nft-card>
      </div>
    </div>
    <div v-else>
      <h3 class="text-center mt-4">You don't have any NFT's at the moment</h3>
    </div>
    <base-dialog
      :show="isDialogWalletConnection"
      title="Welcome"
      @close="isDialogWalletConnection = false"
    >
      <template #body>
        <form>
          <div class="form-group">
            <base-input
              id="walletaddress"
              v-model="v$.walletAddress.$model"
              placeholder="Enter your XRP Wallet Address"
              type="text"
              label-text="Wallet Address"
              class="w-full max-w-xl"
              :is-required="v$.walletAddress.required"
              :is-invalid="v$.walletAddress.$dirty && v$.walletAddress.$invalid"
              :errors="formatVuelidateErrors(v$.walletAddress.$errors)"
            ></base-input>
          </div>
          <!-- <div class="form-group">
            <base-select
              id="type_networks"
              v-model="type_network"
              :choices="type_networks"
              type="type_networks"
              label-text="Network Type"
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
          </div> -->
        </form>
      </template>
      <template #footer>
        <base-button
          status="success"
          class="mt-4"
          :disabled="v$.$invalid"
          @click="populateNFTs"
          >{{ $t("Enter") }}
          <div
            v-if="isLoading"
            class="spinner-grow spinner-grow-sm"
            role="status"
          >
            <span class="sr-only">{{ $t("Loading...") }}</span>
          </div>
        </base-button>
      </template>
    </base-dialog>
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
import { defineComponent, ref, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import NftCard from "@/components/NftCard.vue";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const xAppToken = urlParams.get("xAppToken"); // || "21df3537-65a3-40c1-8a82-8a7439e1c9f8";

interface Choice {
  label: string;
  value: string;
}

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseButton,
    NftCard,
  },
  async setup() {
    const store = useStore();
    const { locale } = useI18n({ useScope: "global" });

    function handleError(): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
      isLoading.value = false;
    }

    const showError = ref(false);
    const isLoggedIn = !!window.localStorage.getItem("address");
    const isDialogWalletConnection = ref(isLoggedIn);
    const isLoading = ref(false);
    const adddress = isLoggedIn ? window.localStorage.getItem("address") : "";
    const walletAddress = ref(adddress);
    const NFTMedia = computed(() => store.getters["nft/getAll"] || []);
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

    if (xAppToken) {
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line @typescript-eslint/no-var-requires

      // const ottdata: OTTData = await Sdk.getOttData();
      console.log("dispatch");

      await store.dispatch("xumm/getOttData");
      const ottdata = computed(() => store.getters["xumm/getOttData"]);

      locale.value = ottdata.value.locale.split("-")[0];
      const net =
        ottdata.value.nodetype == "TESTNET"
          ? test_networks.map((n) => n.value)
          : main_networks.map((n) => n.value);
      // NFTMedia.value = await main(ottdata.account, net, handleError);
      await store.dispatch("nft/fetchAll", {
        walletAddress: ottdata.value.account,
        network: net,
        handleError,
      });
    } else {
      isDialogWalletConnection.value = true;
    }

    return {
      urlParams,
      isDialogWalletConnection,
      main_networks,
      test_networks,
      test_network,
      main_network,
      v$,
      type_network,
      type_networks,
      NFTMedia,
      isLoading,
      showError,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      async populateNFTs() {
        const network =
          type_network.value.value == "test"
            ? test_network.value.value
            : main_network.value.value;
        if (network) {
          isLoading.value = true;

          try {
            await store.dispatch("nft/fetchAll", {
              walletAddress: walletAddress.value,
              network,
              handleError,
            });
            isDialogWalletConnection.value = false;
            isLoading.value = false;
          } catch (err) {
            showError.value = true;
            isDialogWalletConnection.value = false;
            isLoading.value = false;
          }
        }
      },
    };
  },
});
</script>
