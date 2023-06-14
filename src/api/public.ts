import type { IConfigOptions } from "@zjb/utils";

/** ********************************************系统共用********************************************/
const BSAEURL =
  process.env.NODE_ENV === "development" ? "PublicUrl" : "CloudServices";
const PREURL = process.env.NODE_ENV === "development" ? "" : "pubSvr/";

/**
 * 【系统共用】获取验证码(图片)
 * @Author DZY
 * @Description 获取验证码(图片)
 * @CreateDate 2022-10-19
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const getCaptchaImg: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/CaptchaImg",
  method: "GET",
};

/**
 * 【系统共用】获取验证码(手机)
 * @Author DZY
 * @Description 获取验证码(手机)
 * @CreateDate 2022-10-19
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const getCaptchaMobi: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/CaptchaMobi",
  method: "GET",
};

/**
 * 【系统共用】用户登录
 * @Author DZY
 * @Description 用户登录
 * @CreateDate 2022-10-19
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const postLogin: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/Login",
  method: "POST",
};

/**
 * 【系统共用】用户登出
 * @Author DZY
 * @Description 用户登出
 * @CreateDate 2022-10-19
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const postLogout: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/Logout",
  method: "POST",
};

/**
 * 【系统共用】获取菜单权限
 * @Author DZY
 * @Description 用户登出
 * @CreateDate 2022-10-20
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const postUserMenuAuth: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/UserMenuAuth",
  method: "POST",
};

/**
 * 【系统共用】密码修改
 * @Author DZY
 * @Description 修改
 * @CreateDate 2022-10-20
 * @ModifyAuthor
 * @ModifyDate
 * @ModifyDescription
 */
const postChangePwd: IConfigOptions = {
  http: BSAEURL,
  preurl: PREURL,
  url: "Public/ChangePwd",
  method: "POST",
};

export default {
  getCaptchaImg,
  getCaptchaMobi,
  postLogin,
  postLogout,
  postUserMenuAuth,
  postChangePwd,
};
