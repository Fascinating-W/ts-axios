/*
 * @Author: Wanko
 * @Date: 2022-11-16 17:06:47
 * @LastEditors: Wanko
 * @LastEditTime: 2023-02-15 09:23:19
 * @Description: 实现请求逻辑
 */
import cookie from '../helpers/cookie'
import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    // 创建request实例
    const request = new XMLHttpRequest()
    // request初始化  url! 类型断言 url一定会存在（不为空）
    request.open(method.toUpperCase(), url!, true)

    configureRequest()
    addEvents()
    processHeaders()
    processCancel()

    // 发送请求
    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = true
      }
    }
    function addEvents(): void {
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

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }
      if (auth) {
        // btoa base64方法 ，解密atob
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // 如果data是null,用户设置了header是没有有意义的，删除掉
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(() => {
            // do nothing
          })
      }
    }
    function handleResponse(response: AxiosResponse) {
      // 成功的请求, 未定义validateStatus则使用默认的响应状态范围
      if (!validateStatus || validateStatus(response.status)) {
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
