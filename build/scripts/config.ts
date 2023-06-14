import fs, { writeFileSync } from "fs";
import chalk from "chalk";

import { getRootPath, getEnvConfig } from "../utils";

// 获取配置文件名称
const getConfigFileName = (env: NodeJS.ProcessEnv) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_EN_NAME || "__APP"}__CONF__`
    .toUpperCase()
    .replace(/\s/g, "");
};

/**
 * 创建配置文件
 * @param config
 */
function createConfig(config: IConfig) {
  try {
    const windowConf = `window.${config.configName}`;

    // 将不重要的信息进行暴露
    const _config = {
      VITE_GLOB_APP_SHORT_NAME: config.env.VITE_GLOB_APP_SHORT_NAME,
      VITE_GLOB_APP_EN_NAME: config.env.VITE_GLOB_APP_EN_NAME,
      VITE_GLOB_UPLOAD_URL: config.env.VITE_GLOB_UPLOAD_URL,
      VITE_GLOB_IMG_URL: config.env.VITE_GLOB_IMG_URL,
      VITE_OUTPUT_DIR: config.env.VITE_OUTPUT_DIR,
      VITE_CONFIG_FILE_NAME: config.configFileName,
    };
    // 创建的属性不允许修改
    const configStr = `${windowConf}=${JSON.stringify(_config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${config.configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, "");

    if (!fs.existsSync(config.env.VITE_OUTPUT_DIR || "dist")) {
      // 创建文件夹
      fs.mkdirSync(getRootPath(config.env.VITE_OUTPUT_DIR || "dist"));
    }

    // 写入文件内容
    writeFileSync(
      getRootPath(`${config.env.VITE_OUTPUT_DIR}/${config.configFileName}`),
      configStr
    );

    console.log(
      `✨ ${chalk.cyan(
        `创建成功：${chalk.gray(
          config.env.VITE_OUTPUT_DIR + "/" + chalk.green(config.configFileName)
        )}`
      )}`
    );
  } catch (error) {
    console.log(`✨ ${chalk.red("创建失败：" + error)}`);
  }
}

export function runBuildConfig() {
  // 获取 .env.development 或 .env.production 中的数据
  const config = getEnvConfig();
  // 获取文件名称
  const configFileName = getConfigFileName(config);
  // 开始创建配置文件
  createConfig({
    env: config,
    configName: configFileName,
    configFileName: config.VITE_CONFIG_FILE_NAME,
  });
}
