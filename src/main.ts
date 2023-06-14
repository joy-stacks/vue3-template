import { createApp } from 'vue'

import App from './App.vue'
// Plugin
import router, { setupRouter } from './router'
import { setupStore } from './store'
import { setupUIPlugin, setupDirectives, setupGlobal, asyncConfig } from './plugins'
import type { IGlobalConfig } from '@zjb/utils'
// 注入svg脚本
import 'virtual:svg-icons-register'

async function bootstrap(config: IGlobalConfig) {
    // 创建app实例
    const app = createApp(App)

    // 挂载UI组件
    setupUIPlugin(app)

    // 挂载自定义指令
    setupDirectives(app)

    // 挂载Store（状态管理）
    setupStore(app)

    // 挂载路由
    setupRouter(app)

    // 全局挂载属性
    setupGlobal(app, config)

    // 路由准备就绪后挂载 APP 实例
    await router.isReady()

    // 挂载页面
    app.mount('#app', true)
}

(async function () {
    // 先获取配置文件
    const config = await asyncConfig()
    await void bootstrap(config)
})()

