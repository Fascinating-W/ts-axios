/*
 * @Author: Wanko
 * @Date: 2022-12-15 19:45:03
 * @LastEditors: Wanko
 * @LastEditTime: 2022-12-15 19:53:49
 * @Description:
 */
import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
// const source = CancelToken.source()

// axios.get('/cancel/get', {
//   cancelToken: source.token
// }).catch(function(e) {
//   if (axios.isCancel(e)) {
//     console.log('Request canceled', e.message)
//   }
// })

// setTimeout(() => {
//   source.cancel('Operation canceled by the user.')

//   axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
//     if (axios.isCancel(e)) {
//       console.log(e.message)
//     }
//   })
// }, 100)

let cancel: Canceler

axios
  .get('/cancel/get', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled')
    }
  })

// 两秒后取消请求
setTimeout(() => {
  cancel()
}, 200)
