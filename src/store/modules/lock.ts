import { defineStore } from "pinia";

import { store } from "@/store";

// 定义接口类型
export interface ILockState {
  lock: boolean;
}

export const useLockStore = defineStore("LockStore", {
  state: (): ILockState => {
    return {
      lock: false,
    };
  },
  getters: {
    LOCK(): boolean {
      return this.lock;
    },
  },
  actions: {
    setLock(lock: boolean) {
      this.lock = lock;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "zjb-lock",
        storage: sessionStorage,
        paths: ["lock"],
      },
    ],
  },
});

export function useLockStoreWithout() {
  return useLockStore(store);
}
