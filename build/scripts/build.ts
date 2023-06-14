import chalk from "chalk";

import { runBuildConfig } from "./config";

// 创建
export const runBuild = async () => {
  try {
    // 获取命令参数
    const argvList = process.argv.splice(2);
    // 生成配置文件
    if (!argvList.includes("disabled-config")) {
      await runBuildConfig();
    }

    console.log(`✨ ${chalk.cyan(`创建成功：${process.env.VITE_OUTPUT_DIR}`)}`);
  } catch (error) {
    console.log(`✨ ${chalk.red("创建失败：" + error)}`);
    process.exit(1);
  }
};

runBuild();
