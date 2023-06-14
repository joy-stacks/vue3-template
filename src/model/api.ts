import type { IAxiosInstance } from "@zjb/utils";
import type {
  ICaptchaMobiParam,
  ILoginParam,
  ILogoutParam,
  IUserMenuAuthParam,
} from "./request";

import type { ILoginResponse } from "./response";

export interface IApi {
  public: {
    // 获取验证码(图片)
    getCaptchaImg: <T>() => Promise<IResponse<T>>;
    // 获取验证码(手机)
    getCaptchaMobi: <T>(param: ICaptchaMobiParam) => Promise<IResponse<T>>;
    // 登录
    postLogin: <T>(param: ILoginParam) => Promise<IResponse<T>>;
    // 登出
    postLogout: <T>(param: ILogoutParam) => Promise<IResponse<T>>;
    // 获取菜单权限
    postUserMenuAuth: <T>(param: IUserMenuAuthParam) => Promise<IResponse<T>>;
  };
  getAxios: () => IAxiosInstance;
}

export interface IResponse<T> {
  code: number;
  msg: string;
  desc: string;
  data: T;
}

export type TLoginType = "0" | "1";
export type TCacheType = "01" | "02";

export interface ILoginConfig extends ILoginParam {
  AppID: number;
  AppName: string;
  LoginType: TLoginType;
  VerifyCacheType: TCacheType;
}

export interface IMixinUser extends ILoginResponse {
  AppID: number;
  AppName: string;
}
