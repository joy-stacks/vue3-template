<template>
  <div class="upload-wrapper">
    <a-image
      v-if="urlRef !== ''"
      style="flex: 89px"
      :width="89"
      :src="urlRef"
    />
    <div v-else class="unknown">?</div>
    <a-upload
      name="file"
      accept="image/*"
      :data="{ type: dataType }"
      :showUploadList="false"
      :customRequest="customRequest"
    >
      <div class="upload">
        <plus-outlined></plus-outlined>
        <span>{{ description }}</span>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, ref, unref, watch } from "vue";
import api from "@/api";
import { EmitType } from "@/model";

export default defineComponent({
  props: {
    value: { type: String, default: "" },
    description: { type: String, default: "" },
    dataType: { type: String, required: true },
  },
  emits: [EmitType.UPDATE_VALUE],
  setup(props, ctx) {
    const urlRef = ref<string>("");

    watch(
      () => unref(props).value,
      (v) => {
        v === "" && (urlRef.value = "");
      }
    );

    // 自定义上传
    const customRequest = async (f: any) => {
      const formData = new FormData();
      formData.append("file", f.file);
      const result = await api.dirfree.postAFileUpload<{ ObjectName: string }>(
        formData
      );
      if (result && result.code === 1) {
        urlRef.value = window.URL.createObjectURL(f.file);
        const name = result.data.ObjectName;
        ctx.emit(EmitType.UPDATE_VALUE, name);
      } else {
        message.warning((result && result.msg) || "上传失败");
      }
    };

    return {
      urlRef,
      customRequest,
    };
  },
});
</script>
<style lang="less" scoped>
.upload-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 8px;
  box-sizing: border-box;
  padding-right: 16px;

  :deep(.ant-image) {
    border: 1px solid #ccc;
    border-right: 1px dashed #ccc;
  }
  .unknown {
    height: 89px;
    width: 89px;
    border: 1px solid #ccc;
    border-right: 1px dashed #ccc;
    text-align: center;
    line-height: 89px;
  }

  .upload {
    position: relative;
    height: 100%;
    width: 100%;
    cursor: pointer;
    display: flex;
    padding-left: 37px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > span {
      color: #ccc;
    }

    &-status {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 128, 0, 0.6);
      width: 18px;
      height: 18px;
      border-radius: 0 0 0 24px;
    }
  }

  & > span {
    flex: 1;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-left: none;

    :deep(.ant-upload) {
      display: inline-block;
      height: 87px;
      width: 100%;
    }
  }
}
</style>
