import { defineStore } from "pinia";
// 导入 store
import { store } from "@/store";
// 导入默认配置
import themeDefault from "@/layout/Header/theme/theme-default";
import { IProjectConfigOptions } from "@/model";

// 定义接口类型
export interface ISettingState {
  theme: IProjectConfigOptions;
}

export const useSettingStore = defineStore("SettingStore", {
  state: (): ISettingState => {
    return {
      theme: {
        mode: themeDefault.mode,
        navMode: themeDefault.navMode,
        primaryColor: themeDefault.primaryColor,
        isSocket: themeDefault.isSocket,
        isLocked: themeDefault.isLocked,
        isFulled: themeDefault.isFulled,
        interval: 15,
      },
    };
  },
  actions: {
    setMode(theme: "light" | "dark") {
      this.theme.mode = theme;
    },
    setNavMode(theme: "theme-warm" | "theme-dark") {
      this.theme.navMode = theme;
    },
    setPrimaryColor(color: string) {
      this.theme.primaryColor = color;
    },
    setSocket(v: boolean) {
      this.theme.isSocket = v;
    },
    setLocked(v: boolean) {
      this.theme.isLocked = v;
    },
    setFulled(v: boolean) {
      this.theme.isFulled = v;
    },
    setIntervals(v: number) {
      this.theme.interval = v;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "zjb-theme",
        storage: localStorage,
        paths: ["theme"],
      },
    ],
  },
});

export function useSettingStoreWithout() {
  return useSettingStore(store);
}
