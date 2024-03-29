/*
 * @Author: Wanko
 * @Date: 2022-11-17 16:48:14
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 16:57:47
 * @Description:
 */

import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  // AxiosError类的成员属性
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 解决 TypeScript 继承一些内置对象的时候的坑
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

// 工厂函数创建error
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  const error = new AxiosError(message, config, code, request, response)

  return error
}
