import type { Plugin, PluginOption } from "vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import path from "path";

import { configHtmlPlugin } from "./html";
import { configMockPlugin } from "./mock";
import { configCompressPlugin } from "./compress";

// 创建plugin
export function createVitePlugins(
  viteEnv: NodeJS.ProcessEnv,
  isBuild: boolean,
  prodMock: boolean
) {
  const {
    VITE_USE_MOCK,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins: (Plugin | Plugin[] | PluginOption[])[] = [
    vue(),
    vueJsx(),
    visualizer({
      filename: `${path.resolve(process.cwd(), "node_modules")}/.cache/visualizer/stats.html`,
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    createSvgIconsPlugin({
      //  指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[name]",
    }),

    // 按需引入AntDesign且自动创建组件声明
    Components({
      dts: "types/components.d.ts",
      directoryAsNamespace: true,
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
          resolveIcons: true,
          exclude: ["ConfigProvider"],
        }),
      ],
    }),
  ];

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock));

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      )
    );
  }

  return vitePlugins;
}
