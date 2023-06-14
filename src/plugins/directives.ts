import { App } from "vue";

import title from "@/directives/title";
import throttle from "@/directives/throttle";
import focus from "@/directives/focus";

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 设置页面title
  app.directive("title", title);
  // 节流
  app.directive("throttle", throttle);
  // 自动获取焦点
  app.directive("focus", focus);
}
