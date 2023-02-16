/*
 * @Author: Wanko
 * @Date: 2022-12-15 16:29:36
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 18:51:45
 * @Description:
 */
import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   // qs.stringify 将 请求data 变为表单类型提交数据 data: "a=1"
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// }).then(res => {
//   console.log(res.data)
// })
//
// axios({
//   transformRequest: [
//     function(data) {
//       // transformRequest 一定要有返回值
//       return qs.stringify(data)
//     },
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function(data) {
//       if (typeof data === 'object') {
//         data.b = 2
//       }
//       return data
//     }
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then(res => {
//   console.log(res.data)
// })

const instance = axios.create({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res.data)
})
