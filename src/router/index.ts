import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "NFTList",
    component: () => import("../views/NFTList.vue"),
    meta: {
      withAuth: true,
      title: "Home Wallet Page",
    },
  },
  {
    path: "/nft/:nftAddress/:currency/view",
    name: "NFTDetail",
    component: () => import("../views/NFTDetail.vue"),
    meta: {
      withAuth: true,
      announcer: {
        message: "NFT Detail Page",
      },
    },
  },
  {
    path: "/nft/:nftAddress/:currency/update",
    name: "NFTUpdate",
    component: () => import("../views/NFTUpdate.vue"),
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
