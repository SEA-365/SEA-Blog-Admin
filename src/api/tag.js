import request from '@/utils/request'

export function getTagList(query) {
  return request({
    url: '/tags/list', // 获取标签列表
    method: 'post',
    data: query
  })
}

export function getTagById(id) {
  return request({
    url: `/tags/${id}`, // 获取指定标签
    method: 'get',
    params: { id }
  })
}

export function addTag(data) {
  return request({
    url: '/tags/',  // 新增标签
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/tags/', // 修改标签
    method: 'put',
    data
  })
}

export function deleteTagById(id) {
  return request({
    url: `/tags/${id}`,  // 删除指定标签
    method: 'delete',
    params: { id }
  })
}



