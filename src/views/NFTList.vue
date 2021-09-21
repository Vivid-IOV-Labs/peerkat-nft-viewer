<template>
  <div class="flex flex-col justify-center items-center mb-2">
    <base-dialog :show="show" title="Welcome" @close="show = false">
      <template #body>
        <div class="w-full">
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
            id="network"
            v-model="network"
            :choices="networks"
            type="network"
            label-text="Select your Network"
            class="w-full max-w-xl"
          ></base-select>
        </div>
      </template>
    </base-dialog>
  </div>

  <div class="mt-2 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- <nft-card v-for="nft in allNFT" :key="nft.id" :nft="nft"></nft-card> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import useVuelidate from "@vuelidate/core";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { XrplClient } from "xrpl-client";
const main = async () => {
  const X_url = "wss://s.altnet.rippletest.net:51233";

  // const xrpClient = new XrplClient(X_url);

  // Query the user wallet to get a list of all Assets they own
  // const resp = await xrpClient.send({
  //   command: "account_lines",
  //   account: "reWmfYP8FbRyWWEEkhpKzCpEnksg4sAwx",
  // });

  // // Check for assets which have a balance of '1000000000000000e-96' and limit of '1000000000000000e-96'; we will assume it is an NFT
  // // If NFT retrieve the value in currency '786E66742E706565726B61742E6C697665202020'
  // console.log(resp);

  // // For each identified NFT object, look up the address in the account value 'rE1FzsMa4N8xoUia5AKtoWtziyM9uxNhCv'
  // const resp1 = await xrpClient.send({
  //   command: "account_info",
  //   account: "rE1FzsMa4N8xoUia5AKtoWtziyM9uxNhCv",
  // });

  // Retrieve the value in domain '687474703A2F2F'
  //console.log("account_lines", resp1);

  // Then convert the Hex values of 'domain' and 'currency' to utf8
  // Concatenate 'domain' + 'currency' to create url
  // Use url to retrieve the nft image
};

main();

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseSelect,
  },
  setup: () => {
    const walletAddress = ref("");
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
      show: ref(true),
      walletAddress,
      v$,
      networks: [
        { label: "Main", value: "main" },
        { label: "Test", value: "test" },
      ],
      network: { label: "Main", value: "main" },
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
    };
  },
});
</script>
