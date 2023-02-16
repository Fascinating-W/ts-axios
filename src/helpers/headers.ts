/*
 * @Author: Wanko
 * @Date: 2022-11-17 10:38:10
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 18:46:24
 * @Description: 对请求头中的header进行加工
 */

import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'
/**
 * @Description: 将传入的不规范content-type 变为Content-Type
 * @return {*}
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    // 如果两者名字不相等但是大写相等，使用传入的标准名
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * @Description: 处理请求头参数格式
 * @param {any} headers
 * @param {any} data
 * @return {*}
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  // 只有data是普通对象时才会对header进行处理，设置为json类型请求头
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * @Description: 将响应的字符串请求头转为对象
 * @param {string} headers
 * @return {*}
 */
export function parseHeaders(headers: string): any {
  // 创建一个空对象
  let parsed = Object.create(null)
  // 如果headers是空字符串，返回空对象
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    // let [key, vals] = line.split(':')
    // 结构出的vals可能是数组
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    // key是空字符串跳到下次循环
    if (!key) return

    // if (val) val = val.trim()
    const val = vals.join(':').trim()
    parsed[key] = val
  })

  return parsed
}

/**
 * @Description: 把需要的headers提取出来，headers中没用的删掉
 * @param {any} headers
 * @param {Method} method
 * @return {*}
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
