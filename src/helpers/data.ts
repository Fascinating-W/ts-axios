/*
 * @Author: Wanko
 * @Date: 2022-11-17 09:30:26
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 11:33:42
 * @Description: 处理body数据
 */
import { isPlainObject } from './util'
export function transformRequest(data: any): any {
  // 只需要对普通对象做转化，其它数据类型xhr都是支持的
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
/**
 * @Description: 将响应的字符串转为对象
 * @param {any} data
 * @return {*}
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    // 因为不确定响应的字符串是JSON字符串，所以需要trycatch
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
