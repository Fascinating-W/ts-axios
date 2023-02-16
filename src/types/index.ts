/*
 * @Author: Wanko
 * @Date: 2022-11-16 16:45:29
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 16:45:56
 * @Description: 公共类型定义文件
 */

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  // 响应的数据类型 "" | "arraybuffer" | "blob" | "document" | "json" | "text"
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  // transformRequest 是AxiosTransformer函数类型 或 AxiosTransformer函数类型数组
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean

  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
  // 字符串的索引签名
  [propName: string]: any
}

// 响应接口
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// axios 函数返回的是一个 Promise 对象，我们可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
// export interface AxiosPromise extends Promise<AxiosResponse> {}
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}
/**
 * @Description:  错误信息增强，返回更多的错误信息
 * @return {*}
 */
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

/**
 * @Description: 用来描述Axios类中的公共方法
 * @return {*}
 */
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

/**
 * @Description: 混合类型接口，这个接口本身是一个函数，但是又继承了Axios的各种方法
 * @return {*}
 */
// export interface AxiosInstance extends Axios {
//   (config: AxiosRequestConfig): AxiosPromise
//   // 添加一种函数类型定义
//   (url: string, config?: AxiosRequestConfig): AxiosPromise
// }
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>

  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

  // 指向axios的类类型
  Axios: AxiosClassStatic
}

// 拦截器接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  // string类型的promise
  promise: Promise<Cancel>
  // Promise.resolve的参数
  reason?: Cancel

  throwIfRequested(): void
}

// 取消方法接口
export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
