import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/wallet" },
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
        path: ":nftAddress",
        name: "NFTWalletDetail",
        component: () => import("../views/NFTWalletDetail.vue"),
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
        path: ":nftAddress/:currency?",
        name: "NFTSharedDetail",
        component: () => import("../views/NFTSharedDetail.vue"),
        meta: {
          withAuth: true,
          announcer: {
            message: "NFT Shared Detail Page",
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

export default router;
