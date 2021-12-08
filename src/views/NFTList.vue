<template>
  <!-- <div class="d-none d-md-flex justify-center items-center mb-2">

    <small style="font-size: 1rem; font-weight: bold" class="text-xs">{{
      walletAddress
    }}</small>
    <button
      class="ml-2 btn btn-primary btn-xs"
      @click.prevent="isDialogWalletConnection = true"
    >
      change
    </button>
  </div> -->
  <div
    v-if="NFTMedia.length"
    ref="root"
    style="overflow-y: hidden; overflow-x: scroll; padding: 0.6rem 0"
    class="row flex-row flex-nowrap"
  >
    <div v-for="nft in NFTMedia" :key="nft.issuer" class="col-sm-12 col-md-6">
      <nft-card :nft="nft"></nft-card>
    </div>
    <span ref="sentinel" class="sentinel"></span>
  </div>
  <div v-else>
    <h3 class="text-center mt-4">You don't have any NFT's at the moment</h3>
  </div>
  <div
    v-if="isLoading"
    style="
      height: 100%;
      width: 100%;
      position: fixed;
      opacity: 0.8;
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
import BaseDialog from "@/components/BaseDialog.vue";
import NftCard from "@/components/NftCard.vue";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";
import { isRippleAddress } from "../utils/validators";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import { inject } from "vue";
import useIntersectionObserver from "../composable/useIntersectionObserver";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default defineComponent({
  components: {
    BaseInput,
    BaseDialog,
    BaseButton,
    NftCard,
  },
  async setup() {
    const store = useStore();
    const sentinel = ref<HTMLElement | null>(null);

    const { locale } = useI18n({ useScope: "global" });
    const isInXumm = inject("isInXumm");
    function handleError(): void {
      isDialogWalletConnection.value = false;
      showError.value = true;
      isLoading.value = false;
    }

    const showError = ref(false);
    const isLoggedIn = !!window.localStorage.getItem("address");
    const isDialogWalletConnection = ref(false);
    const isLoading = ref(false);
    const adddress = isLoggedIn ? window.localStorage.getItem("address") : "";
    const walletAddress = ref(adddress);
    const NFTMedia = computed(() => store.getters["nft/getAll"] || []);

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
      const network = "test";
      if (network) {
        isLoading.value = true;
        try {
          await store.dispatch("nft/fetchNftLines", {
            walletAddress: walletAddress.value,
            network,
            handleError,
          });
          await store.dispatch("nft/fetchNext");
          isDialogWalletConnection.value = false;
          isLoading.value = false;
        } catch (err) {
          showError.value = true;
          isDialogWalletConnection.value = false;
          isLoading.value = false;
          console.log(err);
        }
      }
    };

    const lines = computed(() => store.getters["nft/getLines"]);

    const fetchNext = async () => {
      await store.dispatch("nft/fetchNext");
    };
    const { unobserve, isIntersecting } = useIntersectionObserver(sentinel);
    watch(isIntersecting, async () => {
      console.log("is Intersecting");
      isLoading.value = true;
      await store.dispatch("nft/fetchNext");
      isLoading.value = false;
    });
    watch(NFTMedia, (newNfts) => {
      console.log("newNfts", newNfts.length);
      console.log("lines", lines.value.length);
      if (lines.value.length == newNfts.length) {
        unobserve();
      }
    });

    if (isInXumm) {
      await store.dispatch("xumm/getOttData");
      const ottdata = computed(() => store.getters["xumm/getOttData"]);

      locale.value = ottdata.value.locale.split("-")[0];
      const net = ottdata.value.nodetype == "TESTNET";
      await store.dispatch("nft/fetchNftLines", {
        walletAddress: ottdata.value.account,
        network: net,
        handleError,
      });
      await store.dispatch("nft/fetchNext");
    } else if (isLoggedIn) {
      //await main();
      await populateNFTs();
    } else {
      isDialogWalletConnection.value = true;
    }

    return {
      urlParams,
      sentinel,
      isDialogWalletConnection,
      v$,
      NFTMedia,
      isLoading,
      showError,
      walletAddress,
      isInXumm,
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
