import { computed } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import store from "../store";

const routes = [
  { path: "/", redirect: "/wallet" },
  {
    path: "/welcome/:redirect?",
    name: "welcome",
    component: () => import("../views/Welcome.vue"),
    meta: {
      withAuth: true,
      title: "Welcome Page",
      announcer: {
        message: "Welcome Page",
      },
    },
  },
  {
    path: "/help",
    name: "help",
    component: () => import("../views/Help.vue"),
    meta: {
      withAuth: true,
      title: "Help Page",
      announcer: {
        message: "Help Page",
      },
    },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: () => import("../views/Wallet.vue"),
    meta: {
      withAuth: true,
      title: "Home Wallet Page",
      announcer: {
        message: "Home Wallet Page",
      },
    },
    children: [
      {
        path: "",
        name: "MyNFTs",
        component: () => import("../views/MyNFTs.vue"),
      },
      {
        path: ":nftAddress/view",
        name: "NFTWalletView",
        component: () => import("../views/NFTWalletView.vue"),
        meta: {
          announcer: {
            message: "NFT View Page",
          },
        },
      },
    ],
  },
  {
    path: "/shared",
    name: "Shared",
    component: () => import("../views/Shared.vue"),
    meta: {
      withAuth: true,
      title: "Home Wallet Page",
    },
    children: [
      {
        path: "",
        name: "SharedNFTs",
        component: () => import("../views/SharedNFTs.vue"),
      },
      {
        path: ":nftAddress/:nodetype",
        name: "NFTSharedDetail",
        component: () => import("../views/NFTSharedDetail.vue"),
        meta: {
          withAuth: true,
          announcer: {
            message: "NFT Shared Detail Page",
          },
        },
      },
      {
        path: ":nftAddress/:nodetype/view",
        name: "NFTSharedView",
        component: () => import("../views/NFTSharedView.vue"),
        meta: {
          withAuth: true,
          announcer: {
            message: "NFT Shared View Page",
          },
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const isInXumm = /xumm/.test(navigator.userAgent);
const walletAddress = computed(() => store.getters["user/getAddress"]);
const nodetype = computed(() => store.getters["user/getNodeType"]);
const isConnected = computed(() => store.getters["nft/getIsConnected"]);
const shared = computed(() => store.getters["nft/getShared"](nodetype.value));

const connectXrpClient = () => {
  store.dispatch("nft/initXrpClient", {
    nodetype: nodetype.value,
  });
};

router.beforeEach(async (to, from, next) => {
  if (isInXumm) {
    if (!isConnected.value) {
      store.commit("ui/setIsloading", true);

      await store.dispatch("xumm/getOttData");
      const ottdata = computed(() => store.getters["xumm/getOttData"]);
      store.commit("user/setAddress", ottdata.value.account);
      store.commit("user/setNodeType", ottdata.value.nodetype);
      store.commit("user/setUser", ottdata.value.user);
      store.dispatch("nft/initXrpClient", {
        nodetype: nodetype.value,
      });
      if (!shared.value) {
        store.commit("nft/initSharedStore", ottdata.value.user);
      }

      const path = ottdata.value.redirect;
      store.commit("ui/setIsloading", false);

      if (path) {
        next({ path });
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    if (!walletAddress.value) {
      if (to.fullPath !== "/welcome") {
        next({
          path: "/welcome",
          params: { nextUrl: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      if (!isConnected.value) {
        try {
          connectXrpClient();
          next();
        } catch (error) {
          next({
            path: "/welcome",
          });
        }
      } else {
        next();
      }
    }
  }
});

export default router;

// [
//   "%c next state",
//   "color: #4CAF50; font-weight: bold",
//   {
//     user: {
//       address: "rMfVCZ6QcVsnkzdbTQhFr2idpcakgxeqEM",
//       network: undefined,
//       nodetype: "TESTNET",
//       user: "141c4559-9d73-47eb-a99c-4a7b5befff98",
//     },
//     ui: { isLoading: true },
//     xumm: {
//       ottData: {
//         version: "2.1.2",
//         locale: "en",
//         currency: "USD",
//         style: "DARK",
//         nodetype: "TESTNET",
//         account: "rMfVCZ6QcVsnkzdbTQhFr2idpcakgxeqEM",
//         accounttype: "REGULAR",
//         accountaccess: "FULL",
//         user: "141c4559-9d73-47eb-a99c-4a7b5befff98",
//         user_device: { currency: "USD" },
//         account_info: {
//           account: "rMfVCZ6QcVsnkzdbTQhFr2idpcakgxeqEM",
//           name: null,
//           domain: null,
//           blocked: false,
//           source: "",
//           kycApproved: false,
//           proSubscription: false,
//         },
//       },
//     },
//     nft: {
//       all: [],
//       sharedwithme: {
//         TESTNET: [],
//         MAINNET: [
//           {
//             issuer: "r31DdaJchVXYHhyrU5FCkbmmZ85giCHN9b",
//             issuerTruncated: "r31DdaJc ............. ",
//             currency: "",
//             tokenName: "",
//             url: "https://ipfs.io/ipfs/",
//             media_type: "text/plain; charset=utf-8",
//           },
//         ],
//         rMfVCZ6QcVsnkzdbTQhFr2idpcakgxeqEM: {
//           TESTNET: [
//             {
//               issuer: "rBgpByeG8zbjMEmYg1CiesdnVsndFZ6wTm",
//               issuerTruncated: "rBgpByeG ............. ",
//               currency: "6E66742E7669766964696F762E6C697665202020",
//               tokenName: "nft.vividiov.live",
//               url: "https://nft.vividiov.live",
//               media_type: "image/png",
//             },
//           ],
//           MAINNET: [],
//         },
//         r9YVgQ78hRZEyz9in6WpjoUbsuH2pFtKv5: { TESTNET: [], MAINNET: [] },
//         "141c4559-9d73-47eb-a99c-4a7b5befff98": { TESTNET: [], MAINNET: [] },
//       },
//       lines: [],
//       xrpClient: null,
//       isConnected: false,
//     },
//   },
// ];
