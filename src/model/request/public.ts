/**
 * 获取验证码（图片）- 请求参数
 */
export interface ICaptchaMobiParam {
  mobile: string;
}

/**
 * 登录 - 请求参数
 */
export interface ILoginParam {
  PassWord: string;
  UserCode: string;
  VerifyCacheKey: string;
  VerifyCacheType: string;
  VerifyCacheValue: string;
}

/**
 * // 登出 - 请求参数
 */
export interface ILogoutParam {
  AuthCode: string;
  InstID: number;
  UserID: number;
}

/**
 * // 获取菜单权限 - 请求参数
 */
export interface IUserMenuAuthParam {
  AppID: number;
  UserID: number;
}
