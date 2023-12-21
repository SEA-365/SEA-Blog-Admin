import request from '@/utils/request'

export function fetchOperationLogList(query) {
  return request({
    url: '/operationLog/list', // 获取操作日志列表接口
    method: 'post',
    data: query
  })
}

export function fetchLoginLogList(query) {
  return request({
    url: '/loginLog/list', // 获取登录日志列表接口
    method: 'post',
    data: query
  })
}
