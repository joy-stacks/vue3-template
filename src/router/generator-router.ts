import api from "@/api";
import {
  IUserMenuAuthParam,
  IUserMenuAuthResponse,
  AppRouteRecordRaw,
  IBizParam,
  IMenuTress,
  IRoutes,
} from "@/model";

const modules = import.meta.glob("../views/!(login|error|dashborad)/*.vue");
const _modules = (file) => modules["../views/" + file + ".vue"];

// 基础路由
const constRoutes: AppRouteRecordRaw = {
  path: "/home",
  redirect: "/index",
};

// 用户权限路由
const userRoutes: AppRouteRecordRaw = {
  path: "/home",
  name: "home",
  component: () =>
    import(/* webpackChunkName: "group-home" */ "@/layout/index.vue"),
  children: [
    {
      path: "/404",
      name: "Error",
      component: () =>
        import(/* webpackChunkName: "group-error" */ "@/views/error/404.vue"),
    },
    {
      path: "/index",
      name: "index",
      component: () =>
        import(/* webpackChunkName: "group-index" */ "@/views/dashborad/index.vue"),
    },
  ],
};

const mainRouter: AppRouteRecordRaw[] = [constRoutes, userRoutes];

/**
 * 动态生成菜单
 * @param data
 * @returns {Promise<IRoutes>}
 */
export const generatorDynamicRouter = (
  data: IUserMenuAuthParam
): Promise<IRoutes> => {
  return new Promise(async (resolve, reject) => {
    // 定义返回的内容
    // 构建菜单栏树
    const trees: IMenuTress[] = [];
    // 生成功能点路由
    const mainRouterChildrens: AppRouteRecordRaw[] = [];

    const rutes: IRoutes = {
      isCreateRoute: false,
      MainRouter: mainRouter,
      MenuTrees: trees,
    };

    try {
      const result = await api.public.postUserMenuAuth<IUserMenuAuthResponse[]>(
        data
      );
      if (result && result.code === 1) {
        // 请求成功，则表示创建路由成功
        rutes.isCreateRoute = true;
        listToTree(result.data, trees, 0);
        generator(trees, mainRouterChildrens);
        userRoutes.children && userRoutes.children.push(...mainRouterChildrens);
      }
      resolve(rutes);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 生成功能点路由
 * @param {Array} trees 菜单栏树
 * @param {Array} routers 返回的路由数组
 * @param {Array} tags 功能点面包屑数组
 */
const generator = (
  trees: IMenuTress[],
  routers: AppRouteRecordRaw[],
  tags?: string[]
) => {
  trees.forEach((item) => {
    const level: string[] = [];
    if (tags) {
      level.push(...tags);
    }
    level.push(item.MenuShortName);
    if (item.FunctionID > 0) {
      let param: IBizParam = {};
      if (!item.BizParam || item.BizParam !== "") {
        try {
          // 解析参数
          param = JSON.parse(item.BizParam) || {};
        } catch (error) {
          param = {};
        }
      }

      const file = `${item.FileName}${item.ObjectName}`;
      // const url = `../views/${item.FileName}${item.ObjectName}.vue`;
      const route: AppRouteRecordRaw = {
        path: item.ObjectName,
        name: item.ObjectName.substring(1),
        component: _modules(file), // () => import(/* @vite-ignore */ url),
        // meta
        meta: {
          title: item.MenuShortName,
          tag: level,
          id: item.MenuID,
          pid: item.ParentMenuID,
          keepAlive: param.keepAlive === false ? false : true,
          isRedirect: param.isRedirect === false ? false : true,
        },
      };
      // 路由添加
      routers.push(route);
    }

    if (item.children && item.children.length > 0) {
      generator(item.children, routers, level);
    }
  });
  return routers;
};

/*
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树数组
 * @param pid 父ID
 */
const listToTree = (
  list: IUserMenuAuthResponse[],
  tree: IMenuTress[],
  pid: number
) => {
  // 获取菜单
  const li = list.filter((it) => {
    return it.ParentMenuID === pid;
  });

  if (li.length === 0) {
    return;
  }
  li.forEach((item) => {
    const child: IMenuTress = {
      ...item,
      children: [],
    };

    if (child.children) {
      // 迭代
      listToTree(list, child.children, item.MenuID);
      tree.push(child);
    }
  });
};
