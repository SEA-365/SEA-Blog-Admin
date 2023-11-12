import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sea-blog-admin/table/list',
    method: 'get',
    params
  })
}
