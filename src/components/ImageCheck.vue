<template>
  <div class="image-check-wrapper">
    <div :class="['check-wrapper', theme === checked ? 'checkd' : '']">
      <SvgIcon
        class="check-wrapper-image"
        :width="80"
        :height="50"
        :name="theme"
        @click="() => handleClick(theme)"
      ></SvgIcon>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { EmitterType } from "@/model";

export default defineComponent({
  components: {
    SvgIcon,
  },
  props: {
    theme: {
      Type: String,
      default: "",
    },
    checked: {
      Type: String,
      default: "",
    },
  },
  setup(_, ctx) {
    // 切换导航栏模式
    const handleClick = (mode: string) => {
      ctx.emit(EmitterType.CHANGE_NAV_THEME, mode);
    };

    return {
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped>
.image-check-wrapper {
  .check-wrapper {
    position: relative;
    height: 62px;
    width: 93px;
    padding: 5px;

    &-image {
      cursor: pointer;
      display: inline-block;
      height: 50px;
      width: 80px;
    }
  }

  .checkd {
    border: 1px solid var(--ant-primary-color);
  }
}
</style>
