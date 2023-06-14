<template>
  <div class="layout-header">
    <ul class="layout-header--left" style="margin-bottom: 0">
      <li class="nav-item" @click="handleCollapsed">
        <MenuFoldOutlined v-show="!collapsed"></MenuFoldOutlined>
        <MenuUnfoldOutlined v-show="collapsed"></MenuUnfoldOutlined>
        <div class="hidden"></div>
      </li>
      <li class="nav-breadcrumb">
        <a-breadcrumb separator="/">
          <a-breadcrumb-item href="/home">首页</a-breadcrumb-item>
          <a-breadcrumb-item v-for="value in breadcrumbItems" :key="value">{{
            value
          }}</a-breadcrumb-item>
        </a-breadcrumb>
      </li>
    </ul>
    <ul class="layout-header--right" style="margin-bottom: 0">
      <li class="nav-item" @click="() => handleTheme()">
        <a-tooltip placement="bottom" title="主题">
          <MoreOutlined />
        </a-tooltip>
      </li>
      <li class="nav-menu">
        <img
          src="@/assets/images/user.jpg"
          alt=""
          class="ant-avatar ant-avatar-circle"
        />
        <a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <span style="color: var(--theme-text-color)">{{ user && user.UserName }}</span>
            <CaretDownOutlined />
          </a>
          <template #overlay>
            <a-menu
              @click="({ key }) => handleMenuClick({ key: key as string })"
            >
              <a-menu-item key="0">
                <template #icon>
                  <UnlockFilled />
                </template>
                <span>密码修改</span>
              </a-menu-item>
              <a-menu-item key="1">
                <template #icon>
                  <QuestionCircleFilled />
                </template>
                <span>帮助文档</span>
              </a-menu-item>
              <a-menu-item key="2">
                <template #icon>
                  <InfoCircleFilled />
                </template>
                <span>升级记录</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="9">
                <template #icon>
                  <PoweroffOutlined style="color: red" />
                </template>
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
      <li class="nav-item" @click="toggleFullScreen" v-show="isFulled">
        <a-tooltip
          placement="bottom"
          :title="fullscreenIcon === 'FullscreenOutlined' ? '全屏' : '退出全屏'"
        >
          <component :is="fullscreenIcon" />
        </a-tooltip>
      </li>
      <li class="nav-item" v-show="isLocked" @click="handleLock">
        <a-tooltip placement="bottom" title="锁屏">
          <UnlockOutlined />
        </a-tooltip>
      </li>
      <li class="nav-item" v-show="isSocket">
        <a-tooltip placement="bottom" title="您有5条消息未读">
          <a-badge dot>
            <BellOutlined style="font-size: 20px" />
          </a-badge>
        </a-tooltip>
      </li>
    </ul>

    <!-- 主题弹窗 -->
    <theme ref="drawerSetting"></theme>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  unref,
  onBeforeUnmount,
  onMounted,
  computed,
  ref,
  onDeactivated,
} from "vue";
// 导入图标
import {
  BellOutlined,
  UnlockOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  CaretDownOutlined,
  UnlockFilled,
  QuestionCircleFilled,
  InfoCircleFilled,
  PoweroffOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useUserStore } from "@/store/modules/user";
import { useSettingStore } from "@/store/modules/setting";

// 主题设置窗口
import Theme from "./theme.vue";
// 导入公用函数
import { Meta } from "@/model";
import router from "@/router";
import { useLockStore } from "@/store/modules/lock";

// 定义state接口属性
interface IHeaderState {
  fullscreenIcon: string;
  collapsed: boolean;
  visiable: boolean;
}

export default defineComponent({
  name: "ZHeader",
  components: {
    Theme,
    BellOutlined,
    UnlockOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoreOutlined,
    CaretDownOutlined,
    UnlockFilled,
    QuestionCircleFilled,
    InfoCircleFilled,
    PoweroffOutlined,
  },
  setup(_props, context) {
    // 获取登录人员信息
    const { getUser, logout } = useUserStore();
    const { theme } = useSettingStore();
    const { setLock } = useLockStore();

    const user = getUser;
    const route = useRoute();
    // 定义状态属性
    const state = reactive<IHeaderState>({
      fullscreenIcon: "FullscreenOutlined",
      collapsed: false,
      visiable: false,
    });

    // 菜单栏关闭与打开
    const handleCollapsed = () => {
      state.collapsed = !state.collapsed;
      context.emit("collapsed:header", state.collapsed);
    };

    // 主题弹窗
    const drawerSetting = ref();
    const handleTheme = () => {
      const { openTheme } = drawerSetting.value;
      openTheme();
    };

    const breadcrumbItems = computed(() => {
      return (unref(route).meta as unknown as Meta).tag as string[];
    });

    // 监听全屏
    const toggleFullscreenIcon = () =>
      (state.fullscreenIcon =
        document.fullscreenElement !== null
          ? "FullscreenExitOutlined"
          : "FullscreenOutlined");

    // 全屏切换
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    // 锁屏
    const handleLock = () => {
      setLock(true);
    };

    const handleMenuClick = ({ key }: { key: string }) => {
      switch (key) {
        case "0":
          message.success("暂不支持修改");
          break;
        case "1":
          message.success("暂无帮助文档");
          break;
        case "2":
          break;
        case "9":
          logout()
            .then(() => {
              router.push({ path: "/login" });
            })
            .catch((e) => {
              message.error(e && e.message);
            });
          break;
      }
    };

    // 屏幕小于指定值时，菜单栏自动收缩
    const resize = () => {
      if (document.body.clientWidth <= 1400) {
        if (!state.collapsed) {
          handleCollapsed();
        }
      }
    };

    // 是否开启通信
    const isSocket = computed(() => theme.isSocket);
    // 是否开启锁屏
    const isLocked = computed(() => theme.isLocked);
    // 是否开启全屏
    const isFulled = computed(() => theme.isFulled);
    // 主题
    const mode = computed(() => theme.mode);

    onMounted(() => {
      // 监听全屏切换事件
      document.addEventListener("fullscreenchange", toggleFullscreenIcon);
      window.addEventListener("resize", resize);
      resize();
    });

    onDeactivated(() => {
      window.removeEventListener("resize", resize);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("fullscreenchange", toggleFullscreenIcon);
      window.removeEventListener("resize", resize);
    });

    return {
      user,
      breadcrumbItems,
      drawerSetting,
      isSocket,
      isLocked,
      isFulled,
      mode,
      ...toRefs(state),
      handleCollapsed,
      handleTheme,
      toggleFullScreen,
      handleMenuClick,
      handleLock,
    };
  },
});
</script>

<style lang="less" scoped>
.layout-header {
  height: 50px;
  box-shadow: 2px 2px 2px #000;
  position: relative;
  background-color: var(--theme-bg-color);

  &--left li {
    float: left;
    position: relative;
  }

  &--right li {
    float: right;
    position: relative;
  }

  .nav-item {
    height: 50px;
    width: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
    cursor: pointer;

    &::before {
      content: "";
      width: 0;
      height: 2px;
      background: #000;
      position: absolute;
      top: -1px;
      left: 50%;
      transition: all 0.3s;
    }

    &:hover::before {
      left: 0%;
      width: 100%;
    }
  }

  .nav-breadcrumb {
    height: 50px;
    padding: 0 5px;

    :deep(.ant-breadcrumb),
    :deep(.ant-dark-breadcrumb) {
      line-height: 50px;

      & > span {
        float: left;
      }
    }
  }

  .nav-menu {
    padding: 0 10px;

    .ant-avatar,
    .ant-dark-avatar {
      margin-right: 4px;
    }

    .ant-dropdown-link,
    .ant-dark-dropdown-link {
      color: #595959;
    }
  }
}

.active {
  width: 50px !important;
}

.hidden {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  transition: width 0.2s;
  border-top: 2px solid black;
}

.breadcrumb-enter,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s ease;
}

.breadcrumb-move {
  transition: all 0.5s ease;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
