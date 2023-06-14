import { IProjectConfigOptions } from "@/model";

const themeDefault: IProjectConfigOptions = {
  // 主题模式
  mode: "light",
  // 导航栏模式
  navMode: "theme-warm",
  // 主题颜色
  primaryColor: "#1890ff",
  // 开启通信
  isSocket: false,
  // 开启锁屏
  isLocked: false,
  // 开启全屏
  isFulled: true,
  interval: 900
};

export default themeDefault;
