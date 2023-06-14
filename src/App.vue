<template>
  <ConfigProvider
    componentSize="middle"
    :locale="zhCN"
    :prefixCls="mode === 'dark' ? 'ant-dark' : 'ant'"
  >
    <router-view></router-view>
  </ConfigProvider>
</template>
<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

import "ant-design-vue/dist/antd.variable.min.css";
// import "ant-design-vue/dist/antd.dark.min.css";

import { useSettingStore } from "@/store/modules/setting";
import { ref, watch } from "vue";

import themeDefault from "./layout/Header/theme/theme-default";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { updateDarkTheme, updateHeaderBgColor } from "./layout/Header/theme/dark";
dayjs.locale("cn");

const mode = ref<"dark" | "light">("light");

// 获取store中的值
const { theme } = useSettingStore();
mode.value = theme.mode!;

watch(
  () => theme.primaryColor,
  () => {
    change();
  }
);

watch(
  () => theme.mode,
  () => {
    mode.value = theme.mode!;
  }
);

const change = () => {
  ConfigProvider.config({
    theme: {
      primaryColor: theme.primaryColor || themeDefault.primaryColor,
    },
  });
};

change();

// 改变样式
updateDarkTheme(theme.mode);
updateHeaderBgColor();
</script>

<style lang="less">
@import url(@/styles/index.less);
</style>
