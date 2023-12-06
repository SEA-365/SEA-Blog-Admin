import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login', // 登录请求路径
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info', // 获取用户信息
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
