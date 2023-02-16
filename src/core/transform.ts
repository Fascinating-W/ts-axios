/*
 * @Author: Wanko
 * @Date: 2022-12-15 17:18:48
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 17:20:51
 * @Description:
 */
import { AxiosTransformer } from '../types'

/**
 * @Description:
 * fns: 转化函数数组
 * @return {*}
 *
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  // 不是数组强制转为数组，为了方便便利
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    // 链式调用转化函数，每次转化函数的结果作为下次转化函数的参数调用
    data = fn(data, headers)
  })
  return data
}
