import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/media",
    name: "MediaList",
    component: () => import("../views/MediaList.vue"),
  },
  {
    path: "/media/add",
    name: "MediaAdd",
    component: () => import("../views/MediaAdd.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
