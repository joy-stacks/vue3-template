import { createVNode } from "vue";
import * as icons from "@ant-design/icons-vue";

export * from "./bus";
export * from "./dom";
export * from "./color";

/**
 * 渲染动态渲染Antd图标
 */
export const RenderIcon = function (props) {
  const { icon } = props;
  return createVNode(icons[icon]);
};

// 获取下拉框label值
export const getLabel = function (model: any, key: string, option) {
  model[key] = option.label || "";
};
