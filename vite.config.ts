import dayjs from "dayjs";
import { loadEnv } from "vite";
import { resolve } from "path";

// 打包函数
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build/vite/plugin";

import { createProxy } from "./build/vite/proxy";
// package 项目属性
import pkg from "./package.json";
// 类型
import type { UserConfig, ConfigEnv } from "vite";

const { dependencies, devDependencies, name, version } = pkg;

// 创建时间戳
const timestamp = dayjs(new Date()).format("YYYYMMDDHHmmss");

// 项目相关的信息
const __APP_INFO__: IAppInfo = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  // 加载配置文件
  const env = loadEnv(mode, root);
  // 转换数据类型
  const viteEnv = wrapperEnv(env);

  const {
    VITE_PUBLIC_PATH,
    VITE_USE_MOCK,
    VITE_PORT,
    VITE_PROXY,
    VITE_OUTPUT_DIR,
  } = viteEnv;

  const isBuild = command === "build";

  return {
    root: process.cwd(),
    base: VITE_PUBLIC_PATH,
    mode: mode,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    plugins: createVitePlugins(viteEnv, isBuild, VITE_USE_MOCK),
    publicDir: "public",
    cacheDir: "node_modules/.vite",
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve("types") + "/",
        },
        {
          find: "@",
          replacement: pathResolve("src") + "/",
        },
      ],
      dedupe: ["vue"],
      conditions: [],
      mainFields: ["module", "jsnext:main", "jsnext"],
      browserField: true,
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
      preserveSymlinks: false,
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          /* additionalData: `@import "src/styles/var.less";`, */
        },
      },
      devSourcemap: false,
    },
    json: {
      namedExports: true,
      stringify: false,
    },
    esbuild: {},
    assetsInclude: "",
    logLevel: "info",
    clearScreen: true,
    envDir: root,
    envPrefix: "VITE_",
    appType: "spa",
    server: {
      host: true,
      port: VITE_PORT,
      strictPort: true,
      https: false,
      open: false,
      proxy: createProxy(VITE_PROXY),
    },
    optimizeDeps: {
      include: [],
      exclude: ["vue-demi"],
    },
    build: {
      target: "es2015",
      modulePreload: {
        polyfill: true,
      },
      polyfillModulePreload: true,
      outDir: VITE_OUTPUT_DIR,
      assetsDir: "static",
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      cssTarget: "chrome80",
      sourcemap: mode === "development",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      minify: true,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: `assets/js/${timestamp}/[name].[hash].js`,
          // 用于命名代码拆分时创建的共享块的输出命名
          // 　　chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          // assetFileNames: `assets/[name].[hash].[ext]`,
          assetFileNames: (chunkinfo) => {
            // 匹配css
            if (/\.css$/gi.test(chunkinfo.name)) {
              return `assets/css/${timestamp}/[name].[hash].[ext]`;
            } else if (
              /(\.png|\.jpg|\.gif|\.jpeg|\.ico)$/gi.test(chunkinfo.name)
            ) {
              return `assets/images/${timestamp}/[name].[hash].[ext]`;
            } else if (/\.svg$/gi.test(chunkinfo.name)) {
              return `assets/svg/${timestamp}/[name].[hash].[ext]`;
            }
            return `assets/${timestamp}/[name].[hash].[ext]`;
          },
          // 拆分js到模块文件夹
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split("/")
              : [];
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || "[name]";
            return `assets/js/${timestamp}/${fileName}/[name].[hash].js`;
          },
        },
      },
    },
  };
};
