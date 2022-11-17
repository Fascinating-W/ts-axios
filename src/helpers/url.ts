/*
 * @Author: Wanko
 * @Date: 2022-11-16 18:09:26
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 09:53:56
 * @Description: 处理url相关的辅助函数
 */
import { isDate, isPlainObject } from './util'

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

export function buildURL(url: string, params?: any): string {
  if (!params) {
    // 如果没传params,原样返回url
    return url
  }

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
  let serializedParams = parts.join('&')

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
