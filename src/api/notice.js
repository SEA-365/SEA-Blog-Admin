import request from '@/utils/request'

export function getNoticeList(query) {
  return request({
    url: '/notices/list', // 获取公告列表
    method: 'post',
    data: query
  })
}

export function getNoticeById(id) {
  return request({
    url: '/notices/${id}', // 获取指定公告
    method: 'get',
    params: { id }
  })
}

export function addNotice(data) {
  return request({
    url: '/notices/',  // 新增公告
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notices/', // 修改公告
    method: 'put',
    data
  })
}

export function deleteNoticeById(id) {
  return request({
    url: `/notices/${id}`,  // 删除指定公告
    method: 'delete',
    params: { id }
  })
}



