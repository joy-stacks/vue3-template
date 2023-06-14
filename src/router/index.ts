import { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";

import { useUserStoreWithout } from "@/store/modules/user";
import { usePermissionStoreWithout } from "@/store/modules/permission";

import "nprogress/nprogress.css";

// 导入基础路由
import baseRoutes from "./base-routes";

const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes as any,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 使用钩子函数对路由进行权限跳转
router.beforeEach(async (to, _, next) => {
  NProgress.start();
  NProgress.inc();

  // 根据路径为单点登录，直接放行
  if (to.path === "/") return next();

  // 如果是到登录页面，直接放行
  if (to.path === "/login") return next();

  // 获取token
  const user = useUserStoreWithout().getUser;
  const { isCreateRoute, generateRoutes } = usePermissionStoreWithout();

  // 登录权限验证(未登录，则返回登录页面)
  if (!user) return next("/login");
  // 判断是否已经动态生成路由
  if (!isCreateRoute) {
    const param = {
      UserID: user.UserID,
      AppID: user.AppID
    };
    // 发起请求
    const response = await generateRoutes(param);
    if (!response) {
      return next({
        path: "/login",
      });
    }

    // 添加路由 TODO: 后续解决
    if (response && response.length > 0) {
      response.forEach((route) => router.addRoute(route as any));
    }
    // 路由添加完成，跳转到当前页面
    return next({
      ...to,
      replace: true,
    });
  } else {
    return next();
  }
});

// 后置路由守卫
router.afterEach(() => {
  NProgress.done();
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
