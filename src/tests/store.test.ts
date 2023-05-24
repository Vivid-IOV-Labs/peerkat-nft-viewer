// @vitest-environment jsdom

import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";

import App from "../App.vue";
import Welcome from "../views/Welcome.vue";
import { describe, test, expect } from "vitest";
import userGetters from "../store/modules/user/getters";
import nftGetters from "../store/modules/nft/getters";

const store = createStore({
  modules: {
    user: {
      namespaced: true,
      state: {
        address: "rDF8kbsdZYfNSbXFwPLJEVBMB9p5P9pS5M",
        network: "wss://xrpl.link",
        nodetype: "MAINNET",
        user: "default",
      },
      getters: userGetters,
    },
    nft: {
      namespaced: true,
      state: {
        all: [
          {
            tokenTaxon: 1,
            issuer: "rfUkZ3BVmgx5aD3Zo5bZk68hrUrhNth8y3",
            currency:
              "000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8",
            tokenName: "xPEPE 1497",
            url: "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
            media_type: "image/png",
            thumbnailType: "image/png",
            type: "image",
            desc: "xPEPE vol 1 - An XRPL community collection of 5,000 generative xPEPEs - Minted on xrpnft.com - Art by Link",
            issuerTruncated: "rfUkZ3BV ............. ",
            standard: "XLS-20",
            attributes: [
              {
                trait_type: "Background",
                value: "Background Xrp",
              },
              {
                trait_type: "Base",
                value: "Base Beard",
              },
              {
                trait_type: "Eye",
                value: "Eyes Suspicious Bloodshot",
              },
              {
                trait_type: "Hat",
                value: "Hat Unicorn",
              },
              {
                trait_type: "Shirt",
                value: "Shirt White Rags",
              },
              {
                trait_type: "Mouth",
                value: "Mouth Sad",
              },
            ],
            collection: {
              name: "xPEPE",
            },
            thumbnail:
              "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
            nft_serial: 1496,
            URI: "516D556A71565134524B35597A647937765159435664635351503252314B5771567A5A4B386F364A6B4479517639",
            assets: {
              image: {
                media_type: "image/png",
                mediaUrl:
                  "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
              },
            },
            selloffers: [
              {
                amount: "99000000",
                flags: 1,
                nft_offer_index:
                  "C76984B647255B8CAC4C1CE8E3B4FE8E002551C939197028B073AA05414C147F",
                owner: "rDF8kbsdZYfNSbXFwPLJEVBMB9p5P9pS5M",
              },
            ],
            buyoffers: [],
            thumbnailUrl:
              "/apidev/assets/images/000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8/200px/image",
          },
        ],
        allXls20: [
          {
            tokenTaxon: 1,
            issuer: "rfUkZ3BVmgx5aD3Zo5bZk68hrUrhNth8y3",
            currency:
              "000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8",
            tokenName: "xPEPE 1497",
            url: "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
            media_type: "image/png",
            thumbnailType: "image/png",
            type: "image",
            desc: "xPEPE vol 1 - An XRPL community collection of 5,000 generative xPEPEs - Minted on xrpnft.com - Art by Link",
            issuerTruncated: "rfUkZ3BV ............. ",
            standard: "XLS-20",
            attributes: [
              {
                trait_type: "Background",
                value: "Background Xrp",
              },
              {
                trait_type: "Base",
                value: "Base Beard",
              },
              {
                trait_type: "Eye",
                value: "Eyes Suspicious Bloodshot",
              },
              {
                trait_type: "Hat",
                value: "Hat Unicorn",
              },
              {
                trait_type: "Shirt",
                value: "Shirt White Rags",
              },
              {
                trait_type: "Mouth",
                value: "Mouth Sad",
              },
            ],
            collection: {
              name: "xPEPE",
            },
            thumbnail:
              "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
            nft_serial: 1496,
            URI: "516D556A71565134524B35597A647937765159435664635351503252314B5771567A5A4B386F364A6B4479517639",
            assets: {
              image: {
                media_type: "image/png",
                mediaUrl:
                  "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
              },
            },
            selloffers: [
              {
                amount: "99000000",
                flags: 1,
                nft_offer_index:
                  "C76984B647255B8CAC4C1CE8E3B4FE8E002551C939197028B073AA05414C147F",
                owner: "rDF8kbsdZYfNSbXFwPLJEVBMB9p5P9pS5M",
              },
            ],
            buyoffers: [],
            thumbnailUrl:
              "/apidev/assets/images/000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8/200px/image",
          },
        ],
        allXls14: [],
        currentNFT: null,
        lastVisited: null,
        sellOffers: [],
        buyOffers: [],
        sharedBuyOffers: {},
        sharedwithme: {},
        lines: [],
        xls20nfts: [],
        xrpClient: null,
        isConnected: false,
      },
      getters: nftGetters,
    },
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/welcome",
      name: "Welcome",
      component: Welcome,
    },
  ],
});

describe("App", () => {
  test("renders a component via routing", async () => {
    // create local router

    // navigate to route
    router.push("/welcome");

    // await navigation from push()
    await router.isReady();

    // install the local router
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.findComponent(Welcome).exists()).toBe(true);
  });
});
