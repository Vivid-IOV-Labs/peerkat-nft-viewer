<template>
  <a href="#" class="mb-4 btn btn-link w-100" @click.prevent="back">Back </a>

  <div v-if="nft">
    <h2 class="text-center">Create Sell Offer</h2>
    <div class="w-80 p-1">
      <base-card v-if="nft">
        <template #picture>
          <figure style="overflow: hidden">
            <a href="#">
              <video
                v-if="nft.media_type?.includes('video')"
                :src="nft.url"
                muted
                class="img-fluid card-img"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
              />
              <img
                v-else-if="nft.media_type?.includes('image')"
                v-lazy="nft.url"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
                class="img-fluid card-img"
                alt="Card
          image cap"
              />
              <img
                v-else
                :src="'/thumbnail.jpg'"
                style="
                  object-fit: cover;
                  height: 100%;
                  object-position: center top;
                "
                class="img-fluid card-img"
                alt="Card
          image cap"
              />
            </a>
          </figure>
        </template>
        <template #title>
          <strong class="h6 font-weight-bold">Token Name </strong><br />
          {{ nft.tokenName }}
        </template>

        <template #text>
          <div v-if="nft.author" class="mt-2">
            <strong class="h7 font-weight-bold">Author </strong><br />
            <span class="mr-3">{{ nft.author }} </span>
          </div>
          <div v-if="nft.desc" class="mt-2">
            <strong class="h7 font-weight-bold">Description </strong><br />
            <span>{{ nft.desc }}</span>
          </div>
          <div v-if="nft.currency" class="mt-2">
            <strong class="h7 font-weight-bold">Tokent ID </strong><br />
            <span>{{ nft.currency }}</span>
          </div>
          <div class="form-group flex justify-between mt-4">
            <strong class="h7 font-weight-bold">Sale Amount (XRP)</strong><br />
            <base-input
              id="saleamount"
              v-model="saleamount"
              :label-hidden="true"
              label-text="saleamount"
              type="number"
            ></base-input>
          </div>
          <div class="form-group flex justify-between mt-4">
            <strong class="h7 font-weight-bold">Destination (Optional) </strong
            ><br />
            <base-input
              id="destination"
              v-model="formData.destination"
              :label-hidden="true"
              label-text="destination"
              type="text"
              placeholder="XRP Address"
              :is-required="'required' in v$.destination"
              :is-invalid="v$.destination?.$dirty && v$.destination.$invalid"
              :errors="formatVuelidateErrors(v$.destination.$errors)"
            ></base-input>
          </div>
        </template>
        <template #footer>
          <async-button class="m-auto w-100" :on-click="confirmSell"
            >Confirm</async-button
          >
        </template>
      </base-card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import BaseCard from "../components/BaseCard.vue";
import AsyncButton from "../components/AsyncButton.vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/BaseInput.vue";

import { devlog } from "../utils/devlog";

import { isInXumm } from "../utils/isInXumm";
import XummSdk from "../services/XummService";
import { fetchSellOffers } from "../services/XrpService";
import { openSignRequest } from "../utils/XummActions";
import { isRippleAddress } from "../utils/validators";
import useValidator from "../composable/useValidator";

export default defineComponent({
  components: { BaseCard, AsyncButton, BaseInput },
  async setup() {
    const router = useRouter();
    const store = useStore();
    const nft = computed(() => store.getters["nft/getCurrent"]);

    const saleamount = ref(0);
    const destination = ref("");

    const walletAddress = computed(() => store.getters["user/getAddress"]);
    const user = computed(() => store.getters["user/getUser"]);

    const inputsData = reactive<{ destination: string }>({
      destination: "",
    });
    const rules: Record<string, any> = computed(() => ({
      destination: { valid_address: isRippleAddress },
    }));
    const { formData, v$, formatVuelidateErrors, validate } = useValidator(
      inputsData,
      rules
    );
    return {
      nft,
      saleamount,
      destination,
      formData,
      v$,
      formatVuelidateErrors,
      async confirmSell() {
        const isValid = await validate();
        if (!isValid) {
          console.log("loggingin");
          return;
        }
        if (isInXumm()) {
          devlog("isInXumm", isInXumm);

          const { created } = await XummSdk.createSellOffer(
            {
              Account: walletAddress.value,
              NFTokenID: nft.value.currency,
              Amount: (saleamount.value * 1000000).toString(),
              Destination: destination.value,
              User: user.value,
            },
            async () => {
              const { offers } = await fetchSellOffers(nft.value.currency);

              await store.commit(
                "nft/addSellOffer",
                offers.filter((o: any) => o.owner == walletAddress.value)
              );
              router.push({ path: "sell" });
            }
          );
          const { uuid } = created;
          openSignRequest(uuid);
        } else {
          try {
            await store.dispatch("nft/createSellOffer", {
              walletAddress: walletAddress.value,
              TokenID: nft.value.currency,
              amount: saleamount.value,
            });
          } catch (error) {
            devlog("CretaPayload", error);
          }
        }
        router.push({ path: "sell" });
      },
      back() {
        router.go(-1);
      },
    };
  },
});
</script>
