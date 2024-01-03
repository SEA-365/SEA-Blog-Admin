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
    url: '/users/logout', // 用户登出
    method: 'get'
  })
}

export function getUserList(query) {
  return request({
    url: '/users/list', // 获取用户列表
    method: 'post',
    data: query
  })
}

export function getUserById(id) {
  return request({
    url: `/users/${id}`, // 获取指定用户
    method: 'get',
    params: { id }
  })
}

export function addUser(data) {
  return request({
    url: '/users/',  // 新增用户
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/', // 修改用户
    method: 'put',
    data
  })
}

export function deleteUserById(id) {
  return request({
    url: `/users/${id}`,  // 删除指定用户
    method: 'delete',
    params: { id }
  })
}



