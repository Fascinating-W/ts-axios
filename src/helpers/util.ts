/*
 * @Author: Wanko
 * @Date: 2022-11-16 18:20:22
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 18:42:19
 * @Description: 工具辅助方法
 */

const toString = Object.prototype.toString

/**
 * @description: 是否是日期对象
 * @param {any} val
 * @return {*}
 */
// val is Date 使用类型谓词方式的类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

/**
 * @Description: 判断是普通对象
 * @param {any} val
 * @return {*}
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extent<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    // 一般括号前加; (to as T&U) 强制类型断言
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
