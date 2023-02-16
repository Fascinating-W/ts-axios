/*
 * @Author: Wanko
 * @Date: 2022-12-15 19:03:22
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 19:38:27
 * @Description:
 */
import { CancelExecutor, Canceler, CancelTokenSource } from '../types'

// Cancel类既可以当做值使用也可以当做类型使用
import Cancel from './Cancel'

// 定义一个函数类型的接口
interface ResolvePromise {
  // 参数 reason 返回值void
  (reason?: Cancel): void
}

export default class CancelToken {
  // 两个成员属性
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // 防止多次调用
      if (this.reason) return
      this.reason = new Cancel(message)
      // 将pending状态的promise变为resolve
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    // cancel的赋值在函数内，ts检测不到，需要使用！断言不为空
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
  /**
   * @Description: 判断如果存在 this.reason，说明这个 token 已经被使用过了，直接抛错。
   */

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
