import { Http } from '@zjb/utils'
import config from '@/config/config'

import type { IHttpConfigOptions, IHttpOptions } from '@zjb/utils'
import type { IApi } from '@/model'

const http = new Http(true, {
    version: '1.0.0',
    custom: false,
    scheme: config.Scheme,
    accessKey: config.AccessKey,
    accessKeySecret: config.AccessKeySecret
})

const modules = import.meta.glob('@/api/*.ts', {
    eager: true
})

let options: IHttpOptions[] = []
for (const key in modules) {
    let modelName: string = ''
    // 正则获取模块名称
    const reg = /\/(?<model>[a-zA-Z]+)\.ts/
    const match = key.match(reg)
    if (match) {
        modelName = match.groups!['model']
    }

    // 如果当前模块名称是 index，则剔除
    if (modelName.toLocaleLowerCase() !== 'index' && Object.prototype.hasOwnProperty.call(modules, key)) {
        const module: any = modules[key]
        const def: IHttpConfigOptions = module.default
        let configOptions: IHttpConfigOptions = def
        options.push({
            model: modelName,
            configOption: configOptions
        })
    }
}

http && http.init(options)
const api: IApi = http as unknown as IApi

export default api