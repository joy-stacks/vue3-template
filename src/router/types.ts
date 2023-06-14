import type { RouteMeta, RouteRecordRaw, RouteRecordRedirectOption } from 'vue-router'

import { defineComponent } from 'vue';
import { IUserMenuAuthResponse } from '@/model';

export type Component<T extends any = any> =
    | ReturnType<typeof defineComponent>
    | (() => Promise<typeof import('*.vue')>)
    | (() => Promise<T>);

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children' | 'redirect'>, Omit<RouteRecordRedirectOption, 'redirect'> {
    name?: string,
    meta?: Meta,
    component?: Component,
    children?: AppRouteRecordRaw[],
    redirect?: string
}

export interface Meta extends RouteMeta {
    // 名称
    title?: string,
    // 是否忽略权限
    ignoreAuth?: boolean,
    permissions?: string[],
    // tag
    tag?: string[],
    // 是否缓存
    keepAlive?: boolean,
    // 是否固定在tab上
    affix?: boolean,
    // 是否单独跳转独立页面
    isRedirect?: boolean,
    //隐藏
    hidden?: boolean,
    // 当前功能点ID
    id: number,
    // 当前功能点菜单ID
    pid: number
}

/* export interface Menu {
    title: string;
    label: string;
    key: string;
    meta: Meta;
    name: string;
    component?: Component | string;
    components?: Component;
    children?: AppRouteRecordRaw[];
    props?: Recordable;
    fullPath?: string;
    icon?: any;
    path: string;
    permissions?: string[];
    redirect?: string;
    sort?: number;
} */

export interface IModuleType {
    default: Array<RouteRecordRaw> | RouteRecordRaw;
}

export interface IRoutes {
    isCreateRoute: boolean,
    MainRouter: AppRouteRecordRaw[],
    MenuTrees: IMenuTress[]
}

export interface IBizParam {
    // 是否页面缓存
    keepAlive?: boolean,
    // 是否跳转到新页面
    isRedirect?: boolean
}

export interface IMenuTress extends IUserMenuAuthResponse {
    children?: IUserMenuAuthResponse[]
}