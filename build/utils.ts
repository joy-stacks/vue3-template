import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function isDevFn(mode: string): boolean {
  return mode === "development";
}

export function isProdFn(mode: string): boolean {
  return mode === "production";
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === "true";
}

const regNum = /^[0-9]+$/;
const regBool = /^[false|true]$/;

// 数据类型进行转换
export function wrapperEnv(envConf: Recordable): NodeJS.ProcessEnv {
  const ret: NodeJS.ProcessEnv = {};

  for (const envName of Object.keys(envConf)) {
    // 获取值
    let realName: any = envConf[envName].replace(/\\n/g, "\n");
    // 判断值的类型
    if (regNum.test(realName)) {
      realName = Number(realName);
    } else if (regBool.test(realName)) {
      realName === "true" ? true : realName === "false" ? false : realName;
    } else {
      try {
        realName = JSON.parse(realName);
      } catch (error) {}
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }

  return ret;
}

/**
 * 加载配置文件内容
 * @param confFiles
 * @returns
 */
export function getEnvConfig(
  confFiles = [".env.development", ".env.production"]
): NodeJS.ProcessEnv {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(
        fs.readFileSync(path.resolve(process.cwd(), item))
      );
      envConfig = { ...envConfig, ...env };
    } catch (error) {}
  });

  // 赋值 到 process.env
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });

  return envConfig;
}

/**
 * 获取项目根路径
 * @param dir 目录数组
 * @returns
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}
