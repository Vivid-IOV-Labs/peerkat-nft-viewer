import { computed } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import { trackPage, trackUser } from "../utils/analytics";
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

function handleError(err: any): void {
  console.log(err);
}
const connectXrpClient = async () => {
  store.commit("ui/setIsloading", true);

  await store.dispatch("nft/initXrpClient", {
    nodetype: nodetype.value,
    handleError,
  });
  store.commit("ui/setIsloading", false);
};

router.beforeEach(async (to, from, next) => {
  trackPage(to.fullPath);
  if (isInXumm) {
    await store.dispatch("xumm/getOttData");
    const ottdata = computed(() => store.getters["xumm/getOttData"]);
    trackUser(ottdata.value.account);
    store.commit("user/setAddress", ottdata.value.account);
    store.commit("user/setNodeType", ottdata.value.nodetype);
    const path = ottdata.value.redirect;
    await connectXrpClient();

    if (path) {
      next({ path });
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
          await connectXrpClient();
          next();
        } catch (error) {
          next({
            path: "/welcome",
          });
          console.log(error);
        }
      } else {
        next();
      }
    }
  }
});

export default router;
