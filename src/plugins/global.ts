import { App } from "vue";
import api from '@/api'

import type { IGlobalConfig, IWindow } from "@zjb/utils";
// 获取原始的请求对象
const axios = api.getAxios()

export function asyncConfig(): Promise<IGlobalConfig> {
    return new Promise((resolve) => {
        axios.get('/config.json').then(response => {
            const config = response.data as IGlobalConfig
            (window as IWindow).config = config 
            resolve(config)
        })
    })
}

export function setupGlobal(app: App<Element>, config: IGlobalConfig) {
    app.provide('$config', config)
}