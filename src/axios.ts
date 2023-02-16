/*
 * @Author: wanko
 * @Date: 2022-11-16 16:42:41
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-16 16:48:16
 * @Description:
 */

import Axios from './core/Axios'
import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import { extent } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

/**
 * @Description: 工厂函数创建axios实例,拥有request方法 和axios类中的原型和实例属性或方法
 * @return {*}
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // instance函数 是 Axios原型上的request方法
  const instance = Axios.prototype.request.bind(context)

  // 把Axios上的原型属性和实例属性都拷贝到instance上

  extent(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)
// 添加create方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

// 添加静态方法
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

// axios.all是对Promise.all的封装
axios.all = function all(promises) {
  return Promise.all(promises)
}

// spread是一个高阶函数 接受一个函数参数 返回一个函数, 其作用就是 结构Promise.all的数组返回结果
axios.spread = function spread(callback) {
  //
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios

export default axios
