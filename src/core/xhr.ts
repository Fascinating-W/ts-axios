/*
 * @Author: Wanko
 * @Date: 2022-11-16 17:06:47
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 17:49:50
 * @Description: 实现请求逻辑
 */
import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }
    // url! 类型断言 url一定会存在（不为空）
    request.open(method.toUpperCase(), url!, true)

    request.onreadystatechange = function handleLoad() {
      // 只有4才代表请求正常
      if (request.readyState !== 4) {
        return
      }

      // 网络错误或超时错误的 status是0
      if (request.status === 0) {
        return
      }

      // 通过 XMLHttpRequest 对象的 getAllResponseHeaders 方法获取到的值是字符串
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 处理网络错误
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 处理超时错误
    request.ontimeout = function handleTimeout() {
      reject(
        // ECONNABORTED 被终止的请求
        createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
      )
    }

    Object.keys(headers).forEach(name => {
      // 如果data是null,用户设置了header是没有有意义的，删除掉
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    function handleResponse(response: AxiosResponse) {
      // 成功的请求
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        // 处理状态码错误
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
