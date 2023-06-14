/**
 * 获取验证码(图片) - 响应参数
 */
export interface ICaptchaImgResponse {
  ID: string;
  Base64Blob: string;
}

/**
 * 登录 - 响应参数
 */
export interface ILoginResponse {
  UserID: number;
  InstID: number;
  InstType: string;
  InstName: string;
  DeptID: number;
  UserCode: string;
  UserName: string;
  AuthCode: string;
  IsPwdExpr: string;
  PwdExprValue: number;
}

/**
 * 获取菜单权限 - 响应参数
 */
export interface IUserMenuAuthResponse {
  BizParam: string;
  DisplayOrder: number;
  FileName: string;
  FunctionID: number;
  MenuID: number;
  MenuName: string;
  MenuShortName: string;
  ObjectName: string;
  ParentMenuID: number;
  PicName: string;
  children?: IUserMenuAuthResponse[];
}
