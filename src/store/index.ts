import type { App } from 'vue'
import { createPinia } from 'pinia'
// 永久性存储
import piniaPluginPersist from 'pinia-plugin-persist'

// 创建仓库
const store = createPinia()
store.use(piniaPluginPersist)

export function setupStore(app: App<Element>) {
    app.use(store)
}

export { store }