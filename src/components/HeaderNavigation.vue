<template>
  <nav class="navbar sticky-top navbar-light bg-light">
    <span class="navbar-brand">
      <img
        src="@/assets/img/logopeerkat.png"
        alt="Peerkat logo"
        width="40"
        height="40"
        class="d-inline-block align-top"
      />
    </span>
    <h6 style="text-transform: uppercase; font-weight: bold">
      NFT Test Wallet
    </h6>
    <div class="locale-changer">
      <select v-model="$i18n.locale">
        <option
          v-for="locale in languages"
          :key="`locale-${locale.label}`"
          :value="locale.value"
        >
          {{ locale.label }}
        </option>
      </select>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseSelect from "@/components/BaseSelect.vue";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XrplClient } = require("xrpl-client");

interface NFT {
  url: string;
  issuer: string;
  currency: string;
}

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
const main = async (walletAddress: string, network: string): Promise<NFT[]> => {
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

  const NFTMedia: NFT[] = await Promise.all(
    NFTs.map(async (line: line) => {
      const { account, currency } = line;
      console.log("line", line);
      const { account_data } = await xrpClient.send({
        command: "account_info",
        account,
      });
      const { Domain } = account_data;

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
};

export default defineComponent({
  components: {
    BaseSelect,
  },
  setup: () => {
    return {
      languages: [
        { label: "EN", value: "en" },
        { label: "EL", value: "el" },
        { label: "DE", value: "de" },
        { label: "IT", value: "it" },
      ],
    };
  },
});
</script>
