/*
 * @Author: Wanko
 * @Date: 2022-11-17 17:29:41
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 17:49:57
 * @Description: 发送请求的核心模块
 */

import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types/index'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
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
  config.headers = tranformHeaders(config)
  config.data = transformRequestData(config)
}

/**
 * @Description: 处理url
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
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
  res.data = transformResponse(res.data)
  return res
}
