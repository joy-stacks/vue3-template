<template>
  <div class="login-wrapper" v-title="`${config.App} - ${config.AppTitle}`">
    <div class="login-header">
      <div class="logo"></div>
      <div class="title">
        {{
          `${config.App ? config.App + " - " : ""}${config.AppTitle} ${
            config.AppVersion
          }`
        }}
      </div>
      <div class="theme">
        <SvgIcon
          style="cursor: pointer"
          :name="mode === 'dark' ? 'sun' : 'moon'"
          :height="24"
          :width="24"
          @click="handleClick"
        ></SvgIcon>
      </div>
    </div>
    <div class="login-content">
      <div class="login-content-wrapper">
        <div class="login-content-logo"></div>
        <div class="login-content-main">
          <a-form
            class="login-content-form"
            :rules="rules"
            :model="model"
            ref="modelRef"
          >
            <a-tabs
              default-active-key="01"
              size="large"
              @change="handleTabChange"
            >
              <a-tab-pane key="01" tab="用户登录">
                <a-form-item name="UserCode">
                  <a-input
                    v-model:value.trim="model.UserCode"
                    placeholder="用户名"
                    autocomplete="on"
                  >
                    <template #prefix>
                      <user-outlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="PassWord">
                  <a-input-password
                    v-model:value.trim="model.PassWord"
                    placeholder="密码"
                    autocomplete="off"
                  >
                    <template #prefix>
                      <lock-outlined />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item name="ImageCode">
                  <a-input
                    v-model:value.trim="model.ImageCode"
                    placeholder="验证码"
                    @keyup.enter="handleLogin"
                  >
                    <template #prefix>
                      <safety-certificate-outlined />
                    </template>
                    <template #suffix>
                      <img
                        class="ant-avatar validate-code"
                        :src="model.ImageBlob"
                        title="点击刷新"
                        @click="handleValidateCode"
                      />
                    </template>
                  </a-input>
                </a-form-item>
              </a-tab-pane>
              <a-tab-pane key="02" tab="短信登录">
                <a-form-item name="Mobile">
                  <a-input
                    v-model:value.trim="model.Mobile"
                    placeholder="手机号"
                    autocomplete="on"
                  >
                    <template #prefix>
                      <mobile-outlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="SMSCode">
                  <a-input
                    v-model:value.trim="model.SMSCode"
                    placeholder="短信验证码"
                    @keyup.enter="handleLogin"
                  >
                    <template #prefix>
                      <property-safety-outlined />
                    </template>
                    <template #suffix>
                      <a-button
                        class="validate-code--mobile"
                        type="link"
                        @click="handleValidateCode"
                        :disabled="isend || !/^1[0-9]{10}/.test(model.Mobile)"
                        >{{
                          isend ? `${exteral}s后重试` : "获取验证码"
                        }}</a-button
                      >
                    </template>
                  </a-input>
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
            <a-button class="login-btn" type="primary" @click="handleLogin">
              登录
            </a-button>
          </a-form>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <span class="login-footer-copyright" v-html="config.AppCopyright"></span>
      <span class="login-footer-borwser-version">{{ config.AppTip }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, reactive, toRefs, defineComponent, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/store/modules/user";
import { useSettingStore } from "@/store/modules/setting";
import { mode } from "@/store/getters";

import api from "@/api";
import { IGlobalConfig, encryptMD5, isMobile } from "@zjb/utils";
import { ICaptchaImgResponse, ILoginConfig, TCacheType } from "@/model";
import { RuleObject } from "ant-design-vue/lib/form";
import {
  updateDarkTheme,
  updateHeaderBgColor,
  updateSidebarBgColor,
} from "@/layout/Header/theme/dark";

// 定义状态属性接口
interface ILoginState {
  activeKey: TCacheType;
  exteral: number;
  isend: boolean;
}

interface IModel {
  UserCode: string;
  PassWord: string;
  ImageCode: string;
  Mobile: string;
  SMSCode: string;
  VerifyCacheKey: string;
  ImageBlob: string;
}

export default defineComponent({
  name: "login",
  setup() {
    // 定义配置文件属性
    let config = inject<IGlobalConfig>("$config") as IGlobalConfig;
    // 主题
    const { setMode, theme } = useSettingStore();
    const { setToken, login } = useUserStore();

    const modelRef = ref<any>(null);
    const router = useRouter();

    const state = reactive<ILoginState>({
      activeKey: "01",
      // 短信发送周期
      exteral: 60,
      // 短信是否已经发出
      isend: false,
    });

    // 定义表单属性
    let model = reactive<IModel>({
      UserCode: "",
      PassWord: "",
      ImageCode: "",
      Mobile: "",
      SMSCode: "",
      VerifyCacheKey: "",
      ImageBlob: "",
    });

    const rules = reactive<{ [k: string]: RuleObject | RuleObject[] }>({
      UserCode: [{ required: true, message: "请输入用户", trigger: "blur" }],
      PassWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
      ImageCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      Mobile: [
        {
          required: true,
          validator: (_, value) => {
            if (!value || value === "") {
              return Promise.reject(new Error("请输入手机号码"));
            } else if (!isMobile(value)) {
              return Promise.reject(new Error("无效的手机号码"));
            } else {
              return Promise.resolve();
            }
          },
          trigger: "blur",
        },
      ],
      SMSCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    });

    // 获取验证码
    const handleValidateCode = async () => {
      try {
        // 获取图形验证码
        if (state.activeKey === "01") {
          const result = await api.public.getCaptchaImg<ICaptchaImgResponse>();
          if (result && result.code === 1) {
            model.VerifyCacheKey = result.data.ID;
            model.ImageBlob = result.data.Base64Blob;
          } else {
            message.error((result && result.msg) || "获取图片验证码失败");
          }
        }

        // 获取短信验证码
        if (state.activeKey === "02") {
          const mobile = model.Mobile;
          const param = {
            mobile,
          };

          const result = await api.public.getCaptchaMobi(param);
          if (result && result.code === 1) {
            message.success("验证码发送成功");

            state.isend = true;
            // 计时器开始
            const timeID = setInterval(() => {
              if (state.exteral === 0) {
                state.isend = false;
                clearInterval(timeID);
                state.exteral = 60;
              }
              state.exteral--;
            }, 1000);
          } else {
            message.error((result && result.msg) || "获取短信验证码失败");
          }
        }
      } catch (error) {}
    };

    // 登录
    const handleLogin = () => {
      const fields =
        state.activeKey === "02"
          ? ["Mobile", "SMSCode"]
          : ["UserCode", "PassWord", "ImageCode"];

      try {
        modelRef.value
          .validateFields(fields)
          .then(() => {
            const param: ILoginConfig = {
              // 0：账号登录 1：单点登录
              LoginType: "0",
              VerifyCacheType: state.activeKey,
              AppID: 200007,
              AppName: "用血服务不用跑",
              UserCode: "",
              PassWord: "",
              VerifyCacheKey: "",
              VerifyCacheValue: "",
            };

            // 用户登录
            if (state.activeKey === "01") {
              param.UserCode = model.UserCode;
              param.PassWord = encryptMD5(model.PassWord);
              param.VerifyCacheKey = model.VerifyCacheKey;
              param.VerifyCacheValue = model.ImageCode;

              // 短信登录
            } else if (state.activeKey === "02") {
              param.UserCode = model.Mobile;
              param.VerifyCacheKey = `${model.Mobile}_${model.SMSCode}`;
              param.VerifyCacheValue = model.SMSCode;
            }

            // 开始登录
            login(param)
              .then((data) => {
                setToken(data);
                // 登录成功，跳转到首页
                router.push({ path: "/home" });
              })
              .catch((error: Error) => {
                handleValidateCode();
                message.error((error && error.message) || "登录失败");
              });
          })
          .catch(() => {});
      } catch (error) {
        message.error((error as Error).message);
      }
    };

    // 选择改变
    const handleTabChange = (key) => {
      state.activeKey = key;
      reset();
    };

    const reset = () => {
      modelRef.value.resetFields();
    };

    // 主题改变
    const handleClick = () => {
      const mode = theme.mode === "dark" ? "light" : "dark";
      setMode(mode);
      // 改变样式
      updateDarkTheme(mode);
      updateHeaderBgColor();
      updateSidebarBgColor();
    };

    onMounted(() => {
      handleValidateCode();
    });

    return {
      modelRef,
      mode,
      config,
      model,
      rules,
      ...toRefs(state),
      handleValidateCode,
      handleLogin,
      handleTabChange,
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped>
.login-wrapper {
  background-color: var(--theme-bg-color);
  height: 100%;
  .login-header {
    padding: 0 48px;
    height: 94px;
    display: flex;
    align-items: center;

    .logo {
      position: relative;
      display: inline-block;
      width: 80px;
      height: 80px;
      margin-left: 15px;
      margin-right: 10px;
      background: url(@/assets/images/icon.png) no-repeat;
      background-size: 100% 100%;
    }

    .title {
      display: inline-block;
      position: relative;
      color: var(--theme-text-color);
      font-size: 22px;
    }

    .theme {
      flex: 1;
      text-align: right;
    }
  }

  .login-content {
    background-color: var(--theme-bg-color2);
    border-top: 1px solid var(--theme-border-color);
    border-bottom: 1px solid var(--theme-border-color);

    .login-content-wrapper {
      height: 600px;
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;

      .login-content-logo {
        width: 680px;
        height: 541px;
        background: url(@/assets/images/loginbg.png) right center no-repeat;
      }

      .login-content-main {
        flex: 1;
        position: relative;
        top: 70px;
        align-self: flex-start;
        padding-left: 48px;

        .login-content-form {
          height: 480px;
          width: 440px;
          background: var(--theme-bg-color);
          box-shadow: 1px 0px 1px var(--theme-bg-color3),
            -1px 0 1px var(--theme-bg-color3);
          padding: 48px;

          .icon-meeting::before {
            position: absolute;
            content: "\e900";
            z-index: 9;
            transform: translateY(-50%);
            top: 50%;
            left: 12px;
            font-size: 22px;
            color: rgba(0, 0, 0, 0.65);
          }

          & :deep(.ant-select-selector),
          & :deep(.ant-select-selection-placeholder),
          & :deep(.ant-select-selection-item),
          & :deep(.ant-dark-select-selector),
          & :deep(.ant-dark-select-selection-placeholder),
          & :deep(.ant-dark-select-selection-item) {
            height: 44px;
            line-height: 44px;
          }

          & :deep(.ant-select-selector),
          & :deep(.ant-dark-select-selector) {
            padding-left: 42px;
          }

          & :deep(.ant-input),
          & :deep(.ant-dark-input) {
            height: 36px !important;
            padding-left: 6px;
          }

          & :deep(.ant-select-selection__rendered),
          & :deep(.ant-dark-select-selection__rendered) {
            line-height: 80px;
          }

          & :deep(.ant-select-selection--single),
          & :deep(.ant-dark-select-selection--single) {
            padding-left: 30px;
          }

          & :deep(.ant-input-prefix),
          & :deep(.ant-dark-input-prefix) {
            font-size: 24px;
          }

          & :deep(.login-btn.ant-btn),
          & :deep(.login-btn.ant-dark-btn) {
            width: 100%;
            height: 44px;
            font-size: 20px;
            margin-bottom: 40px;
          }

          & :deep(.ant-tabs-nav-wrap),
          & :deep(.ant-dark-tabs-nav-wrap) {
            justify-content: center;
          }

          .validate-code {
            width: 120px;
            border-radius: 0;
          }
        }
      }
    }
  }

  .login-footer {
    min-width: 1200px;
    margin-top: 24px;
    margin: 24px auto;
    display: flex;
    flex-direction: column;

    .login-footer-copyright,
    .login-footer-borwser-version {
      text-align: center;
      color: #999;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  :deep(.mi-captcha-content) {
    width: 100% !important;
  }

  :deep(.mi-captcha-radar-logo) {
    display: block !important;
  }

  :deep(.mi-captcha) {
    height: 45.8px;
  }
}
</style>
