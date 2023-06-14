export * from './api'
export * from '@/router/types'
export * from '@/store/types'
export * from './request'
export * from './response'
export * from './common'

export enum EmitterType {
    SUBMIT_TAG = 'submit:tag',
    CONTEXT_TAG = 'context:tag',
    CLOSE_TAG_ONE = 'close:tag:one',
    CLOSE_TAG_OTHER = 'close:tag:other',
    CLOSE_TAG_ALL = 'close:tab:all',
    CHANGE_NAV_THEME = 'change:nav:theme'
}

export type TDateType = '1' | '2' | '3' | '4'