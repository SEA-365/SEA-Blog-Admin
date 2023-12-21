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
    method: 'get'
  })
}

export function getUserList(query) {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function getUserById(id) {
  return request({
    url: '/users/${id}',
    method: 'get',
    params: { id }
  })
}

export function addUser(data) {
  return request({
    url: '/users/',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/',
    method: 'put',
    data
  })
}

export function deleteUserById(id) {
  return request({
    url: '/users/${id}',
    method: 'delete',
    params: { id }
  })
}



