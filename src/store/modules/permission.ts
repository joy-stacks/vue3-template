import { defineStore } from "pinia";

import { store } from "@/store";
import { generatorDynamicRouter } from "@/router/generator-router";

import { ITagList } from "../types";
import {
  IRoutes,
  IUserMenuAuthParam,
  AppRouteRecordRaw,
  IMenuTress,
} from "@/model";

// 定义接口类型
export interface IPermissionState {
  isCreateRoute: boolean;
  menus: IMenuTress[];
  openRoutes: any[];
  currentRoute?: string;
  openKeys: string[];
}

export const usePermissionStore = defineStore("PermissionStore", {
  state: (): IPermissionState => {
    return {
      menus: [],
      isCreateRoute: false,
      openRoutes: [],
      currentRoute: undefined,
      openKeys: [],
    };
  },
  getters: {
    GET_PERMISSION(): IPermissionState {
      return {
        isCreateRoute: this.isCreateRoute,
        menus: this.menus,
        openRoutes: this.openRoutes,
        currentRoute: this.currentRoute,
        openKeys: this.openKeys,
      };
    },
  },
  actions: {
    SET_ROUTERS(routers: IRoutes) {
      this.menus = routers.MenuTrees;
      this.isCreateRoute = routers.isCreateRoute;
    },
    SET_OPENROUTES(openRoutes: ITagList[]) {
      this.openRoutes = openRoutes;
    },
    SET_CURRENTROUTE(currentRoute: string) {
      this.currentRoute = currentRoute;
    },
    SET_OPENKEYS(openKeys: string[]) {
      this.openKeys = openKeys;
    },
    // 生成路由
    generateRoutes(param: IUserMenuAuthParam): Promise<AppRouteRecordRaw[]> {
      const that = this;
      return new Promise((resolve, reject) => {
        generatorDynamicRouter(param)
          .then((response: IRoutes) => {
            that.SET_ROUTERS(response);
            resolve(response.MainRouter);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "zjb-permission",
        storage: sessionStorage,
        paths: ["openRoutes", "currentRoute", "openKeys"],
      },
    ],
  },
});

export function usePermissionStoreWithout() {
  return usePermissionStore(store);
}
