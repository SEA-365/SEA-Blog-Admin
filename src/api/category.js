import request from '@/utils/request'

export function getCategoryList(query) {
  return request({
    url: '/categories/list', // 获取分类列表
    method: 'post',
    data: query
  })
}

export function getCategoryById(id) {
  return request({
    url: `/categories/${id}`, // 获取指定分类
    method: 'get',
    params: { id }
  })
}

export function addCategory(data) {
  return request({
    url: '/categories/',  // 新增分类
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/categories/', // 修改分类
    method: 'put',
    data
  })
}

export function deleteCategoryById(id) {
  return request({
    url: `/categories/${id}`,  // 删除指定分类
    method: 'delete',
    params: { id }
  })
}

export function getCategoryByName(body) {
  return request({
    url: `/categories/getCategoryByName`,  // 获取指定分类
    method: 'post',
    data: body
  })
}



