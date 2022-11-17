/*
 * @Author: wanko
 * @Date: 2022-11-16 16:42:41
 * @LastEditors: Wanko
 * @LastEditTime: 2022-11-17 18:56:53
 * @Description:
 */

import Axios from './core/Axios'
import { AxiosInstance } from './types'
import { extent } from './helpers/util'
/**
 * @Description: 工厂函数创建axios实例,拥有request方法 和axios类中的原型和实例属性或方法
 * @return {*}
 */
function createInstance(): AxiosInstance {
  const context = new Axios()
  // instance函数 是 Axios原型上的request方法
  const instance = Axios.prototype.request.bind(context)

  // 把Axios上的原型属性和实例属性都拷贝到instance上

  extent(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
