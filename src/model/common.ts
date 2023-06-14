import { ColumnType } from "ant-design-vue/lib/table";

export type SearchType = "1" | "2";

export interface IPagenation {
  SDate?: string;
  EDate?: string;
  Order: string;
  OrderASC: string;
  Page: number;
  Size: number;
}

export interface IPagenationResponse<T = any> {
  Data: T;
  Total: number;
}

/**
 * 页面通用状态
 */
export interface IPageState<T> {
  loading: boolean;
  columns: Array<ColumnType>;
  data: T[];
  searchType?: SearchType;
  formQuery?: {
    [key: string]: any;
  };
  total?: number;
  page: {
    current: number;
    size: number;
    column: string;
    order: string;
  };
  subHeight?: number;
  visiable?: boolean;
}

// 项目配置
export interface IProjectConfigOptions {
  mode: "light" | "dark";
  primaryColor: string;
  navMode: "theme-warm" | "theme-dark";
  isSocket: boolean;
  isLocked: boolean;
  isFulled: boolean;
  interval: number;
}

export enum SubmitType {
  // 审核通过
  Audit_Approved = "1",
  // 审核不通过
  Audit_NoApproved = "2",
  // 撤销
  Revoke = "3",
}

export interface IDDValues {
  label: string;
  value: string | number;
  children?: IDDValues[];
}

export enum EmitType {
  SEARCH_SUCCESS = "search:success",
  SEARCH_ERROR = "search:error",
  SAVE_SUCCESS = "save:success",
  UPDATE_VALUE = "update:value"
}

export enum SearchDetailType {
  LOG = "log",
  REPAY = "repay",
}
