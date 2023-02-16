/*
 * @Author: Wanko
 * @Date: 2019-06-15 12:21:38
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 16:20:17
 * @Description:
 */
import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'

const strats = Object.create(null)

/**
 * @Description: 默认合并策略，优先取用户自定义配置
 * @param {any} val1 axios默认配置
 * @param {any} val2 用户自定义配置
 * @return {*}
 */
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

/**
 * @Description: 只取用户配置
 */
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
    // val2 !== 'undefined' 判断 val2有值且不是一个对象
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    // config2![key] 类型断言 config[key]不为空
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
