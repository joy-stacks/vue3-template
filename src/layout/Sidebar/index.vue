<template>
    <div class="layout-sidebar">
      <a-menu
        theme="dark"
        mode="inline"
        :openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        @openChange="openChange"
      >
        <template v-for="item in menus">
          <a-sub-menu
            :key="String(item.MenuID)"
            v-if="item.children && item.children.length > 0"
          >
            <template #icon>
              <RenderIcon v-if="item.PicName" :icon="item.PicName"></RenderIcon>
            </template>
            <template #title>
              {{ item.MenuShortName }}
            </template>
            <template v-for="it in item.children">
              <a-sub-menu
                :key="String(it.MenuID)"
                v-if="it.children && it.children.length > 0"
              >
                <template #icon>
                  <RenderIcon v-if="it.PicName" :icon="it.PicName"></RenderIcon>
                </template>
                <template #title>
                  {{ it.MenuShortName }}
                </template>
                <a-menu-item v-for="fun in it.children" :key="fun.ObjectName">
                  <router-link :to="fun.ObjectName">{{
                    fun.MenuShortName
                  }}</router-link>
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item v-else :key="it.ObjectName">
                <template #icon>
                  <RenderIcon v-if="it.PicName" :icon="it.PicName"></RenderIcon>
                </template>
                <router-link :to="it.ObjectName">{{
                  it.MenuShortName
                }}</router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item v-else :key="item.ObjectName">
            <template #icon>
              <RenderIcon v-if="item.PicName" :icon="item.PicName"></RenderIcon>
              {{ item.MenuShortName }}
            </template>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
  </template>
  <script lang="ts">
  import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    watch,
    reactive,
    toRefs,
  } from "vue";
  import { usePermissionStore } from "@/store/modules/permission";
  import { RenderIcon, emitter } from "@/utils";
  import { RouteLocationNormalizedLoaded, useRouter } from "vue-router";
  
  interface ISidebarState {
    openKeys: string[];
    selectedKeys: string[];
  }
  
  export default defineComponent({
    name: "ZSidebar",
    components: {
      RenderIcon,
    },
    setup() {
      const { menus, openKeys, currentRoute, SET_OPENKEYS, SET_CURRENTROUTE } =
        usePermissionStore();
      const state = reactive<ISidebarState>({
        openKeys: [],
        selectedKeys: [],
      });
      const rootSubmenuKeys: string[] = [];
      const router = useRouter();
  
      // 监听路由的改变
      watch(
        () => router.currentRoute.value,
        (v: RouteLocationNormalizedLoaded) => {
          state.selectedKeys.length > 0 && (state.selectedKeys = []);
          state.selectedKeys.push(v.path);
          SET_CURRENTROUTE(v.path);
        }
      );
  
      // 监听菜单栏收缩
      emitter.on("collapsed", (v: boolean) => {
        v ? (state.openKeys = []) : (state.openKeys = openKeys);
      });
  
      // 菜单展开状态改变
      const openChange = (keys: string[]) => {
        const latestOpenKey = keys.find(
          (key) => state.openKeys.indexOf(key) === -1
        );
        if (!latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
          state.openKeys = keys;
        } else {
          state.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
        SET_OPENKEYS(state.openKeys);
      };
  
      // 页面加载
      onMounted(() => {
        currentRoute && state.selectedKeys.push(currentRoute);
        menus.forEach((item) => {
          if (item.children && item.children.length > 0) {
            rootSubmenuKeys.push(item.MenuID + "");
          }
        });
      });
  
      // 页面卸载，取消监听
      onBeforeUnmount(() => {
        emitter.off("collapsed");
      });
  
      return {
        menus,
        ...toRefs(state),
        openChange,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .layout-header {
    height: 50px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    position: relative;
    top: -13px;
  
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
    }
  }
  
  .nav-breadcrumb .ant-breadcrumb {
    line-height: 50px;
  }
  
  .nav-menu {
    padding: 0 10px;
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
  </style>
  