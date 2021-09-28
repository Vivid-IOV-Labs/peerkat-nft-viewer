<template>
  <div class="flex flex-col justify-center items-center mb-2">
    <base-dialog
      :show="isDialogWalletConnection"
      title="Welcome"
      @close="isDialogWalletConnection = false"
    >
      <template #body>
        <div class="w-full justify-center flex flex-col">
          <base-input
            id="walletaddress"
            v-model="v$.walletAddress.$model"
            placeholder="Enter your Ripple Wallet Address"
            type="walletaddress"
            label-text="walletaddress"
            class="w-full max-w-xl"
            :errors="formatVuelidateErrors(v$.walletAddress.$errors)"
          ></base-input>
          <base-select
            id="type_networks"
            v-model="type_network"
            :choices="type_networks"
            type="type_networks"
            label-text="Type Networks"
            class="w-full max-w-xl"
          ></base-select>
          <base-select
            v-if="type_network.value == 'test'"
            id="network"
            v-model="network"
            :choices="test_networks"
            label-text="Network"
            class="w-full max-w-xl"
          ></base-select>
          <base-select
            v-else
            id="network"
            v-model="network"
            :choices="main_networks"
            label-text="Network"
            class="w-full max-w-xl"
          ></base-select>
          <base-button
            class="mt-4"
            :disabled="v$.$invalid"
            @click="populateNFTs"
            >Enter</base-button
          >
        </div>
      </template>
    </base-dialog>
  </div>

  <div class="mt-2 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <nft-card v-for="(nft, i) in NFTMedia" :key="i" :nft="nft"></nft-card>
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");
type line = {
  balance: string;
  limit: string;
  account: string;
  currency: string;
};
function truncate(
  fullStr: string,
  strLen = 8,
  separator = "......",
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
const main = async (walletAddress: string, network: string) => {
  const X_url = network;
  // const X_url = "wss://s.altnet.rippletest.net:51233";

  const xrpClient = new XrplClient(X_url);

  // Query the user wallet to get a list of all Assets they own
  const accountLines = await xrpClient.send({
    command: "account_lines",
    // account: "reWmfYP8FbRyWWEEkhpKzCpEnksg4sAwx",
    account: walletAddress,
  });

  // Check for assets which have a balance of '1000000000000000e-96' and limit of '1000000000000000e-96'; we will assume it is an NFT
  const { lines } = accountLines;

  function isNFT(l: line): boolean {
    return (
      l.balance == "1000000000000000e-96" && l.limit == "1000000000000000e-96"
    );
  }

  const NFTs = lines.filter(isNFT);
  // If NFT retrieve the value in currency '786E66742E706565726B61742E6C697665202020'
  function hexToString(hex: string) {
    var strhex = hex.toString(); //force conversion
    var str = "";
    for (var i = 0; i < strhex.length; i += 2)
      str += String.fromCharCode(parseInt(strhex.substr(i, 2), 16));
    return str.trim();
  }

  const NFTMedia = await Promise.all(
    NFTs.map(async (line: line) => {
      const { account, currency } = line;
      console.log("line", line);
      const { account_data } = await xrpClient.send({
        command: "account_info",
        account,
      });
      const { Domain } = account_data;
      console.log("account_data", account_data);

      const protocol = hexToString(Domain);
      const domain = hexToString(currency);
      return {
        issuer: truncate(account),
        currency: domain,
        url: protocol + domain,
      };
    })
  );

  console.log(NFTMedia);
  return NFTMedia;
  // For each identified NFT object, look up the address in the account value 'rE1FzsMa4N8xoUia5AKtoWtziyM9uxNhCv'
  // const resp1 = await xrpClient.send({
  //   command: "account_info",
  //   account: "rE1FzsMa4N8xoUia5AKtoWtziyM9uxNhCv",
  // });

  // // Retrieve the value in domain '687474703A2F2F'
  // console.log("account_lines", resp1);

  // Then convert the Hex values of 'domain' and 'currency' to utf8
  // Concatenate 'domain' + 'currency' to create url
  // Use url to retrieve the nft image
};

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseSelect,
    BaseButton,
    NftCard,
  },
  setup: () => {
    const isDialogWalletConnection = ref(true);
    const walletAddress = ref("");
    const NFTMedia = ref([]);
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
        value: "wss://xrpl.link",
      },
    ];
    const network = computed(() => {
      return type_network.value.value == "main"
        ? main_networks[0]
        : test_networks[0];
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
      isDialogWalletConnection,
      main_networks,
      test_networks,
      network,
      v$,
      type_network,
      type_networks,
      NFTMedia,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
      async populateNFTs() {
        NFTMedia.value = await main(walletAddress.value, network.value.value);
        isDialogWalletConnection.value = false;
      },
    };
  },
});
</script>
