<template>
  <a-layout
    class="layout-home"
    :class="themeMode"
    v-title="`${config.App ? config.App + ' - ' : ''}${config.AppTitle}`"
  >
    <a-layout-sider
      class="layout-home--sider"
      width="250"
      :trigger="null"
      :collapsed="collapsed"
      :collapsible="true"
    >
      <div class="logo">
        <img
          src="@/assets/images/logo.png"
          alt="血液中心"
          :height="48"
          :width="48"
        />
        <span v-if="!collapsed">{{ `${user && user.AppName}` }}</span>
      </div>
      <ZSidebar></ZSidebar>
    </a-layout-sider>
    <a-layout class="layout-home--main">
      <a-layout-header class="layout-home--header">
        <ZHeader @collapsed:header="handleCollapsed"></ZHeader>
        <ZTag
          @context:tag="handleContenxMenu"
          @submit:tag="handleKeepAlives"
        ></ZTag>
      </a-layout-header>
      <a-layout-content class="layout-home--content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="includes">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>

  <!-- 右键菜单 -->
  <div
    class="contextmenu-container ant-dropdown ant-dropdown-placement-bottomRight"
    :style="contextStyle"
    v-show="contextVisible"
  >
    <ul
      class="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-root ant-dropdown-menu-light ant-dropdown-content"
    >
      <li class="ant-dropdown-menu-item" @click="() => handleCloseTage('1')">
        关闭当前
      </li>
      <li class="ant-dropdown-menu-item" @click="() => handleCloseTage('2')">
        关闭其他
      </li>
      <li class="ant-dropdown-menu-item" @click="() => handleCloseTage('3')">
        关闭全部
      </li>
    </ul>
  </div>
  <!-- 锁屏 -->
  <ZLock
    v-if="isLocked"
    :name="user?.UserName"
    :visiable="lockRef"
    :interval="interval"
    @lock:success="lockSuccess"
    @unlock="unlock"
  ></ZLock>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  watch,
  onBeforeUnmount,
  computed,
} from "vue";
import { useUserStore } from "@/store/modules/user";
import { ZHeader } from "./Header";
import { ZSidebar } from "./Sidebar";
import { ZTag } from "./Tag";
import { EmitterType, ITagList } from "@/model";
import { emitter } from "@/utils";
import { IGlobalConfig } from "@zjb/utils";
import { useSettingStore } from "@/store/modules/setting";
import { useLockStore } from "@/store/modules/lock";

interface IHomeState {
  includes: string[];
  // 标签打开超过10个提示弹窗
  warnable: boolean;
  collapsed: boolean;
  // 右键菜单属性
  contextVisible: boolean;
  contextStyle: any;
  contextCurrent: number;
}

export default defineComponent({
  components: {
    ZHeader,
    ZSidebar,
    ZTag,
  },
  setup() {
    let config = inject<IGlobalConfig>("$config") as IGlobalConfig;
    const user = useUserStore().getUser;
    const { setLock } = useLockStore();

    const settingStore = useSettingStore();
    const theme = settingStore.theme;

    let timer: NodeJS.Timeout | null = null;
    const lockRef = computed(() => useLockStore().LOCK);
    const isLocked = computed(() => theme.isLocked);
    const interval = computed(() => (theme.interval || 15) * 60);
    // 定义属性
    const state = reactive<IHomeState>({
      includes: [],
      warnable: false,
      collapsed: false,
      contextVisible: false,
      contextCurrent: -1,
      contextStyle: null,
    });

    // 菜单栏收缩
    const handleCollapsed = (v: boolean) => {
      state.collapsed = v;
    };

    // 右键展示菜单
    const handleContenxMenu = (e: any, i: number) => {
      state.contextVisible = true;
      state.contextCurrent = i;
      state.contextStyle = {
        left: e.pageX + "px",
        top: e.pageY + "px",
      };
    };

    // 关闭选项卡
    const handleCloseTage = (type: string) => {
      switch (type) {
        case "1":
          emitter.emit(EmitterType.CLOSE_TAG_ONE, state.contextCurrent);
          break;
        case "2":
          emitter.emit(EmitterType.CLOSE_TAG_OTHER);
          break;
        case "3":
          emitter.emit(EmitterType.CLOSE_TAG_ALL);
          break;
      }
    };

    // 关闭右键菜单
    const handleCloseConextMenu = () => {
      state.contextVisible = false;
    };

    // 锁屏
    const lockSuccess = () => {
      setLock(true);
    };
    // 解锁
    const unlock = () => {
      setLock(false);
    };

    // 导航栏主题
    const themeMode = computed(() => theme.navMode);

    watch(
      () => state.contextVisible,
      (bool) => {
        if (bool) {
          document.body.addEventListener("click", handleCloseConextMenu);
        } else {
          document.body.removeEventListener("click", handleCloseConextMenu);
        }
      }
    );

    // 页面标签提示
    const warn = () => {
      state.warnable = true;
      timer = setTimeout(() => {
        state.warnable = false;
        timer && clearTimeout(timer);
      }, 1000);
    };

    // 获取需要keep-alive的页面
    const handleKeepAlives = (tags: ITagList[]) => {
      const arr: string[] = [];
      for (let i = 0, len = tags.length; i < len; i++) {
        tags[i].name && arr.push(tags[i].name);
      }
      state.includes = arr;
    };

    // 页面卸载
    onBeforeUnmount(() => {
      timer && clearTimeout(timer);
      document.body.removeEventListener("click", handleCloseConextMenu);
    });

    // 加载配置文件
    return {
      config,
      user,
      themeMode,
      isLocked,
      interval,
      lockRef,
      ...toRefs(state),
      handleCollapsed,
      handleContenxMenu,
      handleCloseTage,
      lockSuccess,
      unlock,
      warn,
      handleKeepAlives,
    };
  },
});
</script>

<style lang="less" scoped>
.layout-home {
  &--sider {
    overflow-y: auto;
    height: 100vh;
    position: sticky;
    left: 0;
    top: 0;
    bottom: 0;

    .logo {
      margin-left: 16px;
      line-height: 50px;
      box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.05);
      position: relative;
      vertical-align: top;
      white-space: nowrap;
      display: inline-block;
      -webkit-transition: width 0.3s;
      -moz-transition: width 0.3s;
      transition: width 0.3s;
      overflow: hidden;

      img {
        vertical-align: middle;
        height: 48px;
        width: 48px;
      }

      span {
        display: inline-block;
        height: 50px;
        font-size: 18px;
        color: #fff;
        line-height: 50px;
        vertical-align: middle;
        padding-left: 8px;
        font-weight: 700;
        word-spacing: 5px;
        overflow: hidden;
      }
    }
  }

  &--header {
    background-color: #fff;
    height: 88px;
    padding: 0;
    line-height: 50px;
    position: sticky;
    top: 0;
    z-index: 99;
  }

  &--main {
    height: 100%;
  }

  &--content {
    margin: 4px 4px 4px;
    padding: 2px;
    /* background: rgb(245, 247, 249); */
    min-height: 280px;
    min-width: 1366px;
    height: 100%;
    position: relative;
    z-index: 2;
  }
}

.layout-content-animated-enter,
.layout-content-animated-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.layout-content-animated-enter-active,
.layout-content-animated-leave-active {
  transition: all 0.3s ease;
}

/* 暗色主题 */
.theme-dark {
  :deep(.ant-layout-sider),
  :deep(.ant-menu) {
    background-color: #001529 !important;
  }

  :deep(.ant-menu-sub) {
    background-color: #000c17 !important;
  }
}

/* 主题二：暖色主题 */
.theme-warm {
  :deep(.ant-layout-sider),
  :deep(.ant-menu) {
    background-color: #191a23 !important;
  }

  :deep(.ant-menu-sub) {
    background-color: #000c17 !important;
  }
}
</style>
