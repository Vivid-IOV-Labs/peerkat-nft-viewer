<template>
  <div class="container">
    <div class="flex flex-col justify-center items-center mb-2">
      <h2>
        <span>{{ $t("welcome") }}</span>
      </h2>
      <hr />
    </div>
    <div class="row">
      <div
        v-for="(nft, i) in NFTMedia"
        :key="i"
        class="col-sm-6 col-md-4 col-xs-12"
      >
        <nft-card :nft="nft"></nft-card>
      </div>
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
import BaseSelect from "@/components/BaseSelect.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import NftCard from "@/components/NftCard.vue";
import useVuelidate from "@vuelidate/core";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const xAppToken = urlParams.get("xAppToken"); // || "21df3537-65a3-40c1-8a82-8a7439e1c9f8";
const xummApiKey = import.meta.env.VITE_XUMM_API_KEY;

interface NFT {
  url: string;
  issuer: string;
  currency: string;
}
interface Choice {
  label: string;
  value: string;
}
interface OTTData {
  version: string;
  locale: string;
  currency: string;
  style: string;
  nodetype: string; //TESTNET
  account: string;
  accounttype: string;
  user: string;
  user_device: {
    currency: string;
  };
}
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
};
function isNFT(l: line): boolean {
  return (
    l.balance == "1000000000000000e-96" && l.limit == "1000000000000000e-96"
  );
}
function is_hexadecimal(str: string): boolean {
  const regexp = /^[0-9a-fA-F]+$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}
function hexToString(hex: string) {
  var strhex = hex.toString(); //force conversion
  var str = "";
  for (var i = 0; i < strhex.length; i += 2)
    str += String.fromCharCode(parseInt(strhex.substr(i, 2), 16));
  return str.trim();
}
function truncate(
  fullStr: string,
  strLen = 8,
  separator = " ............. ",
  frontChars = 3,
  backChars = 4
) {
  if (fullStr.length <= strLen) return fullStr;
  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}
const main = async (
  walletAddress: string,
  network: string | string[],
  handleError: (error: string) => void
): Promise<NFT[]> => {
  const X_url = network;
  console.log("X_url", X_url);
  const xrpClient = new XrplClient(X_url, {
    assumeOfflineAfterSeconds: 15,
    maxConnectionAttempts: 2,
    connectAttemptTimeoutSeconds: 3,
  });
  xrpClient.on("error", (error: string) => {
    handleError(error);
  });
  await xrpClient.ready();
  const accountLines = await xrpClient.send({
    command: "account_lines",
    account: walletAddress,
  });
  const { lines } = accountLines;
  const NFTs = lines.filter(isNFT);
  const NFTMedia: NFT[] = await Promise.all(
    NFTs.map(async (line: line) => {
      const { account, currency } = line;
      const { account_data } = await xrpClient.send({
        command: "account_info",
        account,
      });
      const { Domain } = account_data;
      const protocol = is_hexadecimal(hexToString(Domain))
        ? hexToString(hexToString(Domain))
        : hexToString(Domain);
      const domain = hexToString(currency);
      return {
        issuer: truncate(account),
        currency: domain,
        url: protocol + domain,
      };
    })
  );
  return NFTMedia;
};

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseSelect,
    BaseButton,
    NftCard,
  },
  async setup() {
    const { locale } = useI18n({ useScope: "global" });

    function handleError(error: string): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
      isLoading.value = false;
    }

    const showError = ref(false);
    const isDialogWalletConnection = ref(false);
    const isLoading = ref(false);

    const walletAddress = ref("");
    const NFTMedia = ref<NFT[]>([]);
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
    console.log(3);

    const v$ = useVuelidate(rules, {
      walletAddress,
    });
    locale.value = "de";

    if (xAppToken) {
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { XummSdkJwt } = require("xumm-sdk");
      const Sdk = new XummSdkJwt(xummApiKey);

      const ottdata: OTTData = await Sdk.getOttData();
      locale.value = ottdata.locale?.split("-")[0];
      const net =
        ottdata.nodetype == "TESTNET"
          ? test_networks.map((n) => n.value)
          : main_networks.map((n) => n.value);
      NFTMedia.value = await main(ottdata.account, net, handleError);
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
            NFTMedia.value = await main(
              walletAddress.value,
              network,
              handleError
            );
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
