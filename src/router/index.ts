import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/wallet" },
  {
    path: "/wallet",
    name: "MyNFTs",
    component: () => import("../views/MyNFTs.vue"),
    meta: {
      withAuth: true,
      title: "Home Wallet Page",
    },
  },
  {
    path: "/shared",
    name: "SharedNFTs",
    component: () => import("../views/SharedNFTs.vue"),
    meta: {
      withAuth: true,
      title: "Home Wallet Page",
    },
  },
  // {
  //   path: "/nft/:nftAddress/:currency/detail",
  //   name: "NFTDetail",
  //   component: () => import("../views/NFTDetail.vue"),
  //   meta: {
  //     withAuth: true,
  //     announcer: {
  //       message: "NFT Detail Page",
  //     },
  //   },
  // },
  {
    path: "/nft/:nftAddress/view",
    name: "NFTView",
    component: () => import("../views/NFTView.vue"),
    meta: {
      withAuth: true,
      announcer: {
        message: "NFT View Page",
      },
    },
  },
  {
    path: "/nft/:nftAddress/:currency/update",
    name: "NFTDetail",
    component: () => import("../views/NFTDetail.vue"),
    meta: {
      withAuth: true,
      announcer: {
        message: "NFT Detail Page",
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.withAuth)) {
//     if (localStorage.getItem("address") == null) {
//       next({
//         path: "/",
//         params: { nextUrl: to.fullPath },
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
