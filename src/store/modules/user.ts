import { defineStore } from "pinia";
// 导入帮助函数
import { decrypt, encryptAES } from "@zjb/utils";
// 导入 store
import { store } from "@/store";
// 导入静态配置文件
import config from "@/config/config";
// 导入usePermissionStore
import { usePermissionStore } from "./permission";
// 请求接口
import api from "@/api";
// 导入类型
import { ILoginConfig, ILoginResponse, IMixinUser, IResponse } from "@/model";

// 定义接口类型
export interface IUserState {
  token: string | undefined;
}

export const useUserStore = defineStore("UserStore", {
  state: (): IUserState => {
    return {
      token: undefined,
    };
  },
  getters: {
    // 获取token值
    getUser: function (): IMixinUser | undefined {
      if (!this.token) return undefined;
      return JSON.parse(decrypt(this.token as string, config.AccessKey));
    },
  },
  actions: {
    // 设置token值
    setToken(data: IMixinUser) {
      this.token = encryptAES(JSON.stringify(data), config.AccessKey);
    },
    // 登录
    login(conf: ILoginConfig): Promise<IMixinUser> {
      return new Promise(async (resolve, reject) => {
        // 请求配置
        const param = {
          PassWord: conf.PassWord,
          UserCode: conf.UserCode,
          VerifyCacheKey: conf.VerifyCacheKey,
          VerifyCacheType: conf.VerifyCacheType,
          VerifyCacheValue: conf.VerifyCacheValue,
        };

        let result: IResponse<ILoginResponse> | undefined = undefined;
        // 非单点登录
        if (conf.LoginType === "0") {
          result = await api.public.postLogin<ILoginResponse>(param);
          // 单点登录
        } else if (conf.LoginType === "1") {
          // result = await api.public.getOsslogin<ILoginResponse>(param);
        }

        if (!result || result.code !== 1) {
          reject(new Error((result && result.msg) || "登录请求失败"));
          return;
        }

        const data = {
          ...result.data,
          AppID: conf.AppID,
          AppName: conf.AppName,
        };

        resolve(data);
      });
    },
    // 登出
    logout(): Promise<null> {
      let that = this;
      return new Promise((resolve, reject) => {
        const token = that.getUser;

        if (!token) return;
        const param = {
          AuthCode: token.AuthCode,
          InstID: token.InstID,
          UserID: token.UserID,
        };
        const promise = api.public.postLogout(param);
        promise
          .then((response) => {
            if (response && response.code === 1) {
              that.$reset();
              usePermissionStore().$reset();
              resolve(null);
            } else {
              reject(new Error(response.msg));
            }
          })
          .catch(() => {
            reject(new Error("登出失败"));
          });
      });
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "zjb-token",
        storage: sessionStorage,
        paths: ["token"],
      },
    ],
  },
});

export function useUserStoreWithout() {
  return useUserStore(store);
}
