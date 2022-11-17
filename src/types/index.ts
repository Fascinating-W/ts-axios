/*
 * @Author: Wanko
 * @Date: 2022-11-16 16:45:29
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 17:18:04
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
}

// 响应接口
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// axios 函数返回的是一个 Promise 对象，我们可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口
export interface AxiosPromise extends Promise<AxiosResponse> {}

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