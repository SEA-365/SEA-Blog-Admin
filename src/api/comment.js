import request from '@/utils/request'

export function getCommentList(query) {
  return request({
    url: '/comments/list', // 获取评论列表
    method: 'post',
    data: query
  })
}

export function getCommentById(id) {
  return request({
    url: '/comments/${id}', // 获取指定评论
    method: 'get',
    params: { id }
  })
}

export function addComment(data) {
  return request({
    url: '/comments/',  // 新增评论
    method: 'post',
    data
  })
}

export function updateComment(data) {
  return request({
    url: '/comments/', // 修改评论
    method: 'put',
    data
  })
}

export function deleteCommentById(id) {
  return request({
    url: `/comments/${id}`,  // 删除指定评论
    method: 'delete',
    params: { id }
  })
}



