/*
 * @Author: Wanko
 * @Date: 2022-11-16 18:09:26
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 16:45:49
 * @Description: 处理url相关的辅助函数
 */
import { isDate, isPlainObject, isURLSearchParams } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    // 如果没传params,原样返回url
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
    // 如果传入的是URLSearchParams对象
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    // 键值对数组
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]

      if (val === null || typeof val === 'undefined') {
        // forEach中return是无法跳出循环的，只能跳到下一次循环
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        // 如果值不是一个数组，将其处理成一个数组
        values = [val]
      }

      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 是否有hash标识
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // 如果有hash标识，忽略掉hash后面的部分
      url = url.slice(0, markIndex)
    }
    // 是否有问号
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

interface URLOrigin {
  protocol: string
  host: string
}
/**
 * @Description: 是否是同源url,一个是判断协议，一个是判断域名
 * @param {string} requestURL
 * @return {*}
 */
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
// 当前页面的url解析
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
/**
 * @Description: 是否是一个绝对地址，如http:// 或者//
 * @param {string} url
 * @return {*}
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  // 删掉baseURL末尾的/ 和要拼接的relativeURL的开头url,防止用户的书写不规范
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
