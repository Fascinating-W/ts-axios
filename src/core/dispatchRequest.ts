/*
 * @Author: Wanko
 * @Date: 2022-11-17 17:29:41
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 16:44:33
 * @Description: 发送请求的核心模块
 */

import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types/index'
import xhr from './xhr'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  //
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

/**
 * @description: 处理config
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // config.headers = tranformHeaders(config)
  // config.data = transformRequestData(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * @Description: 处理url
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

/**
 * @Description: 处理请求data
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function tranformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

/**
 * @Description: 处理response中的data数据
 * @param {AxiosResponse} res
 * @return {*}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 * @Description: 发送请求前检查一下配置的 cancelToken 是否已经使用过了，如果已经被用过则不用法请求，直接抛异常。
 */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
