import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const TAG = '====sea====>request.js====> '

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(TAG + 'service.interceptors.request.use() ---> config:' + JSON.stringify(config))
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 设置每次请求都把token带上
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom statusCode
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(TAG + 'service.interceptors.response.use() ---> response:' + JSON.stringify(response))
    const res = response.data

    // console.log(TAG + 'service.interceptors.response.use() ---> res.statusCode:' + res.statusCode)
    // if the custom statusCode is not 20000, it is judged as an error.
    if (res.statusCode !== 20000) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // 这里需要改成后端约定好的状态码
      if (res.statusCode === 40001) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // console.log(TAG + 'service.interceptors.response.use() ---> 操作成功！' + JSON.stringify(res))
      return res
    }
  },
  error => {
    console.log('err' + JSON.stringify(error)) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
