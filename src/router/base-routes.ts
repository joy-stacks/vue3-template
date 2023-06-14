/**
 * 基础路由
 * @type { *[] }
 */
export default [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
  },
  ,
  {
    path: "/blood-reduction-detail",
    component: () => import("@/views/common/blood-reduction-detail.vue"),
  },
];
