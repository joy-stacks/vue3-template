<!--
@Author DZY
@Description 下拉勾选按钮
@CreateDate 2021-01-18
@ModifyAuthor
@ModifyDate
@ModifyDescription
-->
<template>
  <a-popover v-model:visible="show" trigger="click" placement="bottom">
    <template #title>
      <a-checkbox
        v-model:checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      ></a-checkbox>
    </template>
    <template #content>
      <a-checkbox-group v-model:value="checkedList">
        <a-row v-for="item in plainOptions" :key="item.value" class="check-row">
          <a-checkbox :value="item.value" :disabled="item.disabled">{{
            item.label
          }}</a-checkbox>
        </a-row>
      </a-checkbox-group>
    </template>
    <a-button type="link" @click="handleClick">
      <slot name="title"></slot>
    </a-button>
  </a-popover>
</template>
<script lang="ts">
import {
  onMounted,
  defineComponent,
  PropType,
  watch,
  reactive,
  toRefs,
} from "vue";

export interface IDataSource {
  key: string | number;
  label: string;
  value: string | number;
  checked: boolean;
  disabled: boolean;
}

interface IState {
  show: boolean;
  indeterminate: boolean;
  checkAll: boolean;
  checkedList: string[];
  plainOptions: IDataSource[];
}

export default defineComponent({
  props: {
    title: String,
    dataSource: {
      type: Array as PropType<IDataSource[]>,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const state = reactive<IState>({
      show: false,
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      plainOptions: [],
    });

    watch(
      () => props.dataSource,
      () => {
        state.plainOptions = props.dataSource;
      }
    );

    watch(
      () => state.checkedList,
      (val) => {
        state.indeterminate =
          !!val.length && val.length < state.plainOptions.length;
        state.checkAll = val.length === state.plainOptions.length;
        submit(val);
      }
    );

    const handleClick = () => {
      state.show = !state.show;
    };

    const onCheckAllChange = (e: any) => {
      const plainOptions = state.plainOptions.map((item) => item.value);
      Object.assign(state, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
      });
    };

    // 提交勾选数据
    const submit = (keys?: (string | number)[]) => {
      emit("change", keys);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      handleClick,
      onCheckAllChange,
    };
  },
});
</script>

<style lang="less" scoped>
.check-row {
  :deep(.ant-checkbox-wrapper) {
    display: flex;
    flex-direction: row;
    align-items: center;

    .ant-checkbox {
      top: 0;
    }
    span {
      font-size: 18px;
    }
  }
}
</style>
