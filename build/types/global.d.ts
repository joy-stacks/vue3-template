import { ProxyOptions } from "vite";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      VITE_PORT?: number;
      VITE_PUBLIC_PATH?: string;
      VITE_USE_MOCK?: boolean;
      VITE_DROP_CONSOLE?: boolean;
      VITE_BASE_URL?: string;
      VITE_GLOB_APP_SHORT_NAME?: string;
      VITE_GLOB_APP_EN_NAME?: string;
      VITE_PUBLIC_BSAEURL?: string;
      VITE_MEETING_BSAEURL?: string;
      VITE_PUBLIC_PREURL?: string;
      VITE_MEETING_PREURL?: string;
      VITE_PROXY?: ProxyList;
      VITE_GLOB_UPLOAD_URL?: string;
      VITE_GLOB_IMG_URL?: string;
      VITE_BUILD_COMPRESS?: "none" | "gzip" | "brotli";
      VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE?: boolean;
      VITE_CONFIG_FILE_NAME?: string;
      VITE_OUTPUT_DIR?: string;
    }
  }

  export interface IConfig {
    env: NodeJS.ProcessEnv;
    configName: string;
    configFileName: string;
  }

  export type Recordable<T = any> = {
    [key: string]: string;
  };

  export interface IAppInfo {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  }

  export type ProxyItem = [string, string];
  export type ProxyList = ProxyItem[];
  export type ProxyTargetList = Record<
    string,
    ProxyOptions & { rewrite: (path: string) => string }
  >;
}

export {};
