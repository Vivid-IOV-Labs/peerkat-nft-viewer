<template>
  <div
    v-if="NFTMedia.length"
    ref="root"
    class="d-flex h-100 flex-row flex-nowrap overflow-auto pb-4"
  >
    <div v-for="nft in NFTMedia" :key="nft.issuer" class="col-11">
      <nft-card :nft="nft"></nft-card>
    </div>
    <div
      v-if="NFTMedia.length < lines.length"
      ref="sentinel"
      class="col-11 card"
      style="background: #eee; height: 100%"
    ></div>
  </div>
  <div
    v-if="!NFTMedia.length"
    style="
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
    "
  >
    <h3 class="text-center mt-4">
      Peerkat is not able to find any NFTs in this wallet
    </h3>
    <ul class="text-center mt-4">
      <li>
        To receive an XRPL-issued NFT please ensure that you have correctly
        signed the corresponding trustline transaction
      </li>
      <li>
        You can view an NFT in fullscreen mode, inspect the transaction history
        of an NFT via the Bithomp explorer and share your own NFTs with another
        user to enable them to view the NFTs too
      </li>
      <li>
        Please follow us on Twitter @Peerkatofficial and at
        <external-link class="mr-2" :url="`https://peerkat.io`"
          >peerkat.io</external-link
        >
        for updates and new product releases (XLS-20 minting platform coming
        soon)
      </li>
    </ul>
  </div>
  <div
    v-if="isLoadingNext"
    style="
      height: 100%;
      width: 100%;
      position: fixed;
      opacity: 0.8;
      left: 0;
      top: 0;
      background: #fff;
    "
    class="d-flex align-items-center justify-content-center"
  >
    <div
      class="spinner-border"
      style="width: 4rem; height: 4rem; color: #666"
      role="status"
    >
      <span class="sr-only">Loading...</span>
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
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import ExternalLink from "@/components/ExternalLink.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import NftCard from "@/components/NftCard.vue";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import { inject } from "vue";
import useIntersectionObserver from "../composable/useIntersectionObserver";
import { useRouter } from "vue-router";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseButton,
    NftCard,
    ExternalLink,
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const sentinel = ref<HTMLElement | null>(null);
    const root = ref<HTMLElement | null>(null);
    const { locale } = useI18n({ useScope: "global" });
    const isInXumm = inject("isInXumm");
    function handleError(): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
      isLoading.value = false;
    }

    const showError = ref(false);
    const endscroll = ref(false);
    const isLoggedIn = !!window.localStorage.getItem("address");
    const isDialogWalletConnection = ref(false);
    const isLoading = ref(false);
    const isLoadingNext = ref(false);
    const adddress = isLoggedIn ? window.localStorage.getItem("address") : "";
    const walletAddress = ref(adddress);
    const NFTMedia = computed(() => store.getters["nft/getAll"]);
    const lines = computed(() => store.getters["nft/getLines"]);
    console.log("lines", lines.value);
    console.log("NFTMedia", NFTMedia.value);
    const rules = computed(() => ({
      walletAddress: {
        required,
        isRippleAddress,
      },
    }));

    const v$ = useVuelidate(rules, {
      walletAddress,
    });
    const populateNFTs = async () => {
      isLoading.value = true;
      try {
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: walletAddress.value,
          nodetype: "TESTNET",
          handleError,
        });
        await store.dispatch("nft/fetchNext", "TESTNET");
        isDialogWalletConnection.value = false;
        isLoading.value = false;
      } catch (err) {
        showError.value = true;
        isDialogWalletConnection.value = false;
        isLoading.value = false;
      }
    };

    const { unobserve, isIntersecting } = useIntersectionObserver(sentinel);
    watch(isIntersecting, async () => {
      isLoadingNext.value = true;
      await store.dispatch("nft/fetchNext", "TESTNET");
      setTimeout(() => {
        isLoadingNext.value = false;
      }, 500);
    });
    watch(NFTMedia, (newNfts) => {
      if (lines.value.length == newNfts.length) {
        unobserve();
        endscroll.value = true;
      }
    });

    if (isInXumm) {
      if (lines.value.length === 0) {
        await store.dispatch("xumm/getOttData");
        const ottdata = computed(() => store.getters["xumm/getOttData"]);
        const path = ottdata.value.redirect;
        if (path) {
          router.push({ path });
        }
        locale.value = ottdata.value.locale.split("-")[0];
        // const net = ottdata.value.nodetype == "TESTNET";
        await store.dispatch("nft/fetchNftLines", {
          walletAddress: ottdata.value.account,
          nodetype: ottdata.value.nodetype,
          handleError,
        });
        await store.dispatch("nft/fetchNext", "ottdata.value.nodetype,");
      }
    } else if (isLoggedIn) {
      if (lines.value.length === 0) {
        await populateNFTs();
      }
    } else {
      isDialogWalletConnection.value = true;
    }

    return {
      urlParams,
      sentinel,
      endscroll,
      isDialogWalletConnection,
      v$,
      root,
      lines,
      NFTMedia,
      isLoading,
      showError,
      walletAddress,
      isInXumm,
      isLoadingNext,
      populateNFTs,
      formatVuelidateErrors(errors: any[]) {
        return errors.map((error) => {
          return { text: error.$message, key: error.$uid };
        });
      },
    };
  },
});
</script>
<style scoped>
.horizontal-scroll-container {
  width: 100%;
  height: 100%;

  position: relative;
}
.horizontal-scroll-container__left-scrim:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  background: linear-gradient(to right, #111, transparent);
}
.horizontal-scroll-container__right-scrim:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  height: 100%;
  background: linear-gradient(to left, #111, transparent);
}
.horizontal-scroll-container .horizontal-scroller {
  display: grid;
  grid-gap: 1rem;
  height: 100%;
  padding-right: 0;
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
