/*
 * @Author: Wanko
 * @Date: 2022-12-15 19:35:37
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 19:36:21
 * @Description:
 */
export default class Cancel {
  // 一个成员属性
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}
// 判断是否是cancel的实例
export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
