<template>
  <div class="error-page">
    <div>
      <h1><img src="@/assets/images/404.gif" /></h1>
    </div>
    <div class="error-desc">哎哟~ 你所访问的页面不存在哦</div>
    <div class="error-handle">
      <router-link to="/work-bench">
        <a-button type="primary" size="large">返回首页</a-button>
      </router-link>
      <a-button class="error-btn" type="primary" size="large" @click="goBack"
        >返回上一页</a-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";

export default {
  methods: {
    goBack() {
      const router = useRouter();
      router.go(-1);
    },
  },
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
}
.error-desc {
  font-size: 30px;
  color: #777;
}
.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn {
  margin-left: 100px;
}
</style>
