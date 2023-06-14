<template>
  <a-drawer
    class="z-drawer"
    title="项目配置"
    placement="right"
    :headerStyle="{ height: '50px' }"
    :bodyStyle="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }"
    :width="300"
    :mask="true"
    :closable="true"
    :visible="visible"
    @close="closeTheme"
  >
    <a-divider>主题</a-divider>
    <a-switch
      v-model:checked="themeCheckd"
      class="z-drawer-theme"
      @change="handleThemeChange"
    >
      <template #unCheckedChildren>
        <SvgIcon name="moon"></SvgIcon>
      </template>
      <template #checkedChildren>
        <SvgIcon name="sun"></SvgIcon>
      </template>
    </a-switch>
    <a-divider>导航栏模式</a-divider>
    <div class="z-drawer-nav-theme">
      <a-tooltip
        placement="top"
        v-for="item in navThemes"
        :key="item.theme"
        :title="item.title"
      >
        <ImageCheck
          class="check-img"
          :theme="item.theme"
          :checked="navTheme"
          @change:nav:theme="handleNavThemeChange"
        ></ImageCheck>
      </a-tooltip>
    </div>
    <a-divider>主题颜色</a-divider>
    <div class="z-drawer-color">
      <a-tooltip
        v-for="item in colors"
        placement="top"
        :title="item.title"
        :key="item.color"
      >
        <a-tag :color="item.color" @click="() => handleColorChange(item.color)">
          <check-outlined v-if="colorChecked === item.color" />
        </a-tag>
      </a-tooltip>
    </div>
    <a-divider>界面显示</a-divider>
    <div class="z-drawer-page">
      <div>
        <span style="color: var(--theme-text-color)">开启通信</span>
        <a-tooltip placement="left" title="暂不支持,开发中...">
          <a-switch
            :disabled="true"
            @change="(checked: boolean)=> handleIsChange(checked, '1')"
          ></a-switch>
        </a-tooltip>
      </div>
      <div>
        <span style="color: var(--theme-text-color)">开启全屏</span>
        <a-tooltip placement="left" :title="isFulled ? '关闭全屏' : '开启全屏'">
          <a-switch
            v-model:checked="isFulled"
            @change="(checked: boolean)=> handleIsChange(checked, '3')"
          ></a-switch>
        </a-tooltip>
      </div>
      <div>
        <span style="color: var(--theme-text-color)">开启锁屏</span>
        <a-tooltip placement="left" :title="isLocked ? '关闭锁屏' : '开启锁屏'">
          <a-switch
            v-model:checked="isLocked"
            @change="(checked: boolean)=> handleIsChange(checked, '2')"
          ></a-switch>
        </a-tooltip>
      </div>
      <div>
        <span style="color: var(--theme-text-color)">锁屏时长</span>
        <a-select
          v-model:value="interval"
          style="width: 90px"
          size="small"
          :disabled="!isLocked"
          @change="handleSelectChange"
        >
          <a-select-option :value="15">15分钟</a-select-option>
          <a-select-option :value="30">30分钟</a-select-option>
          <a-select-option :value="45">45分钟</a-select-option>
          <a-select-option :value="60">60分钟</a-select-option>
        </a-select>
      </div>
    </div>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import ImageCheck from "@/components/ImageCheck.vue";
// 导入配置
import themeConfig from "./theme/theme-config";
// 导入默认配置
import themeDefault from "./theme/theme-default";
// 导入 store
import { useSettingStore } from "@/store/modules/setting";
import {
  updateDarkTheme,
  updateHeaderBgColor,
  updateSidebarBgColor,
} from "./theme/dark";

interface IThemeState {
  visible: boolean;
  themeCheckd: boolean;
  colorChecked: string;
  colors: { title: string; color: string }[];
  navThemes: { title: string; theme: string }[];
  navTheme?: "theme-warm" | "theme-dark";
  isSocket: boolean;
  isLocked: boolean;
  isFulled: boolean;
  interval: number;
}

export default defineComponent({
  components: {
    SvgIcon,
    ImageCheck,
  },
  setup() {
    const {
      setMode,
      setNavMode,
      setPrimaryColor,
      setSocket,
      setLocked,
      setFulled,
      setIntervals,
      theme,
    } = useSettingStore();

    const state = reactive<IThemeState>({
      visible: false,
      themeCheckd: false,
      colorChecked: "",
      colors: themeConfig.colors,
      navThemes: themeConfig.navThemes,
      navTheme: undefined,
      isSocket: false,
      isLocked: false,
      isFulled: false,
      interval: 15,
    });

    state.themeCheckd = theme.mode === "light" ? false : true;
    state.colorChecked = theme.primaryColor || themeDefault.primaryColor;
    state.navTheme = theme.navMode || "theme-warm";
    state.isSocket = theme.isSocket;
    state.isLocked = theme.isLocked;
    state.isFulled = theme.isFulled;
    state.interval = theme.interval;

    // 打开主题弹窗
    const openTheme = () => {
      state.visible = true;
    };

    // 关闭主题弹窗
    const closeTheme = () => {
      state.visible = false;
    };

    // 调整主题
    const handleThemeChange = (checked) => {
      const _theme = checked ? "dark" : "light";
      // 数据写入 store中
      setMode(_theme);
      // 改变样式
      updateDarkTheme(_theme);
      updateHeaderBgColor();
      updateSidebarBgColor();
    };

    // 调整导航栏主题
    const handleNavThemeChange = (mode: "theme-warm" | "theme-dark") => {
      state.navTheme = mode;
      // 数据写入 store中
      setNavMode(mode);
    };

    // 调整主题色
    const handleColorChange = (color: string) => {
      state.colorChecked = color;
      // 将改变的颜色提交到 store中
      setPrimaryColor(color);
    };

    // 是否开启通信
    const handleIsChange = (checked: boolean, type: string) => {
      switch (type) {
        // 是否开启通信
        case "1":
          state.isSocket = checked;
          setSocket(checked);
          break;
        // 是否开启锁屏
        case "2":
          state.isLocked = checked;
          setLocked(checked);
          break;
        // 是否开启全屏
        case "3":
          state.isFulled = checked;
          setFulled(checked);
          break;
      }
    };

    // 选择改变
    const handleSelectChange = () => {
      setIntervals(state.interval);
    };

    return {
      ...toRefs(state),
      openTheme,
      closeTheme,
      handleThemeChange,
      handleNavThemeChange,
      handleColorChange,
      handleIsChange,
      handleSelectChange,
    };
  },
});
</script>
<style lang="less" scoped>
.z-drawer {
  padding: 0;

  &-theme {
    line-height: 1;
    background-color: #151515 !important;
  }

  &-nav-theme {
    display: flex;
    flex-direction: row;

    & > div {
      margin: 0 6px;
    }
  }

  &-color {
    :deep(.ant-tag),
    :deep(.ant-dark-tag) {
      padding: 0;
      height: 25px;
      width: 25px;
      text-align: center;
      position: relative;

      &:hover {
        cursor: pointer;
      }

      .anticon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
      }
    }
  }

  &-page {
    display: flex;
    flex-direction: column;
    width: 100%;

    & > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: space-between;
      margin-bottom: 12px;

      & > span {
        font-size: 14px;
        color: #333639;
      }
    }
  }
}
</style>
