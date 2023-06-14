import type { PluginOption } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

import pkg from "../../../package.json";

export function configHtmlPlugin(env: NodeJS.ProcessEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_SHORT_NAME, VITE_PUBLIC_PATH, VITE_CONFIG_FILE_NAME } =
    env;

  const path = VITE_PUBLIC_PATH.endsWith("/")
    ? VITE_PUBLIC_PATH
    : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigSrc = () => {
    return `${path || "/"}${VITE_CONFIG_FILE_NAME}?v=${
      pkg.version
    }-${new Date().getTime()}`;
  };

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOB_APP_SHORT_NAME,
      },
      tags: isBuild
        ? [
            {
              tag: "script",
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : [],
    },
  });

  return htmlPlugin;
}
