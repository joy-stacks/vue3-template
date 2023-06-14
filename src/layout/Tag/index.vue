<template>
  <div class="layout-nav">
    <ul class="layout-nav-tags" style="margin-bottom: 0">
      <li class="tags-prev">
        <DoubleLeftOutlined />
      </li>
      <li class="tags-home" :class="{ active: isActive('/index') }">
        <router-link to="/index" class="link">
          <HomeOutlined />
        </router-link>
      </li>
      <li class="tags-nav">
        <draggable
          v-model="tagsList"
          @start="isDrag = true"
          @end="isDrag = false"
          :component-data="{
            name: 'list',
            tag: 'div',
            type: 'transition-group',
          }"
          v-bind="{
            group: 'form-draggable',
            ghostClass: 'moving',
            animation: 180,
            handle: '.move',
          }"
          item-key="key"
        >
          <div
            v-for="(item, index) in tagsList"
            class="tags-nav-item"
            :class="{ active: isActive(item.path), move: isMove }"
            :key="index"
            @contextmenu.prevent="handleContextMenu($event, index)"
            @mouseover="isMove = true"
            @mouseout="isMove = false"
          >
            <router-link :to="item.path" class="link">
              {{ item.title }}
            </router-link>
            <span
              @click.prevent="closeTags({ key: 'ONE' }, index)"
              class="tags-nav-item-close"
            >
              <CloseOutlined />
            </span>
          </div>
        </draggable>
      </li>
      <li class="tags-next">
        <DoubleRightOutlined />
      </li>
      <li class="tags-down">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu @click="({ key }) => closeTags({ key: key as string })">
              <a-menu-item key="other">
                <a href="javascript:;">关闭其他</a>
              </a-menu-item>
              <a-menu-item key="all">
                <a href="javascript:;">关闭全部</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  watch,
} from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import {
  HomeOutlined,
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { VueDraggableNext } from "vue-draggable-next";

import { emitter } from "@/utils";
import { usePermissionStore } from "@/store/modules/permission";

// 导入接口类型
import { EmitterType, ITagList, Meta } from "@/model";

export default defineComponent({
  name: "ZTags",
  components: {
    HomeOutlined,
    CloseOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    DownOutlined,
    draggable: VueDraggableNext,
  },
  setup(_, context) {
    // 获取当前路由
    const route = useRoute();
    const router = useRouter();
    // stor
    const { SET_OPENROUTES } = usePermissionStore();

    // tag集合
    const tagsList = ref<ITagList[]>([]);
    // 是否可以移动
    const isMove = ref<boolean>(false);
    const isDrag = ref<boolean>(false);

    // 缓存通信提交
    const keepEmit = (list: ITagList[]) => {
      // 获取需要缓存的页面
      const keeps = list.filter((tag) => tag.meta.keepAlive);
      // 提交通信
      keeps.length >= 0 && context.emit(EmitterType.SUBMIT_TAG, keeps);
    };

    // 设置标签
    const setTags = (route: RouteLocationNormalizedLoaded) => {
      route = unref(route);
      // 判断当前路由路径是否是 /index
      if (route.path.toString() === "/index") return;

      tagsList.value.push({
        title: route.meta.title as string,
        path: route.path,
        name: route.name as string,
        meta: {
          id: (unref(route).meta as Meta).id,
          pid: (unref(route).meta as Meta).pid,
          keepAlive: (unref(route).meta as Meta).keepAlive,
        },
      });

      keepEmit(tagsList.value);
      SET_OPENROUTES(tagsList.value);
    };

    // 关闭标签
    const closeTags = ({ key }: { key: string }, index?: number) => {
      // 关闭其他
      if (key.toUpperCase() === "OTHER") {
        const curItem = tagsList.value.filter((item) => {
          return item.path === route.fullPath;
        });
        tagsList.value = curItem;
        SET_OPENROUTES(tagsList.value);

        // 关闭所有标签
      } else if (key.toUpperCase() === "ALL") {
        tagsList.value = [];
        // 先将数据提交到仓库，后进行页面跳转，否则会有一个BUG
        SET_OPENROUTES(tagsList.value);
        router.push({ path: "/home" });

        // 关闭一个标签
      } else if (key.toUpperCase() === "ONE" && index !== undefined) {
        // 获取需要删除的项
        const del = tagsList.value.splice(index, 1)[0];
        const item = tagsList.value[index]
          ? tagsList.value[index]
          : tagsList.value[index - 1];
        if (item) {
          del.path === route.path && router.push({ path: item.path });
        } else {
          router.push({ path: "/home" });
        }
        // 提交通信
        keepEmit(tagsList.value);
        SET_OPENROUTES(tagsList.value);
      }
    };

    // 右键显示菜单栏
    const handleContextMenu = (e, i: number) => {
      context.emit(EmitterType.CONTEXT_TAG, e, i);
    };

    // 判断当前的路由是否激活
    const isActive = (path: string): boolean => path === route.path;

    // 监听路由的变化
    watch(
      () => unref(router.currentRoute),
      (nroute: RouteLocationNormalizedLoaded) => {
        const bool = tagsList.value.some((tag) => tag.name === nroute.name);
        // 如果当前页面缓存，则不需要重新设置tag
        !bool && setTags(nroute);
      }
    );

    // 页面加载完成，创建当前路由的tag
    onMounted(() => {
      setTags(route);

      // 监听事件(关闭当前)
      emitter.on(EmitterType.CLOSE_TAG_ONE, (i: number) => {
        closeTags({ key: "ONE" }, i);
      });
      // 监听事件(关闭其他)
      emitter.on(EmitterType.CLOSE_TAG_OTHER, () => {
        closeTags({ key: "OTHER" });
      });
      // 监听事件(关闭所有)
      emitter.on(EmitterType.CLOSE_TAG_ALL, () => {
        closeTags({ key: "ALL" });
      });
    });

    // 页面卸载取消所有监听
    onBeforeUnmount(() => {
      emitter.off(EmitterType.CLOSE_TAG_ONE);
      emitter.off(EmitterType.CLOSE_TAG_OTHER);
      emitter.off(EmitterType.CLOSE_TAG_ALL);
    });

    return {
      tagsList,
      isMove,
      isDrag,
      isActive,
      closeTags,
      handleContextMenu,
    };
  },
});
</script>
<style lang="less" scoped>
.layout-nav {
  height: 38px;
  position: relative;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--theme-bg-color);
  border-top: 1px solid var(--theme-border-color);

  &-tags {
    height: 38px;
    line-height: 38px;
    background-color: var(--theme-bg-color);
    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border: 0;
    overflow: hidden;
    z-index: 998;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .active {
      background-color: var(--theme-hover-bg-color);
      color: var(--theme-text-color);
      font-weight: 500;
    }

    .active a {
      color: var(--theme-text-color);
      font-weight: 500;
    }

    .active::after {
      height: 2px;
      border: 0;
      border-radius: 0;
      background-color: var(--theme-bg-color4); //#191a23;
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      width: 100%;
      box-sizing: border-box;
      pointer-events: none;
    }

    .tags-prev,
    .tags-home,
    .tags-next,
    .tags-down {
      position: relative;
      width: 38px;
      height: 38px;
      line-height: 38px;
      background-color: var(--theme-bg-color);
      border-left: 1px solid var(--theme-border-color2); // #f6f6f6;
      -webkit-transition: background-color 0.2s;
      transition: background-color 0.2s;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: var(--theme-hover-bg-color); //#f6f6f6;
      }
    }

    .tags-home {
      border-right: 1px solid var(--theme-border-color2); //#f6f6f6;
    }

    .tags-nav {
      flex: 1;

      &-item {
        min-width: auto;
        line-height: 38px;
        border-right: 1px solid var(--theme-border-color2);
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
        -webkit-transition: background-color 0.2s;
        transition: background-color 0.2s;
        display: inline-block;
        font-size: 14px;
        position: relative;
        text-align: center;
        cursor: pointer;
        padding: 0 7px;
        padding-right: 24px;

        & .link {
          padding: 0 7px;
        }

        &:hover {
          background-color: var(--theme-hover-bg-color);
        }

        &-close {
          width: 16px;
          height: 16px;
          line-height: 16px;
          font-size: 10px;
          border-radius: 50%;
          position: absolute;
          top: 11px;
          right: 8px;
          -webkit-transition: background-color 0.2s, color 0.2s;
          transition: background-color 0.2s, color 0.2s;

          &:hover {
            background-color: #ff5722;
            color: #fff;
          }
        }
      }
    }
  }

  .link,
  .ant-dropdown-link {
    color: #595959;
  }
}
</style>
