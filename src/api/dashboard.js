import request from '@/utils/request'

export function getPanelCount() {
  return request({
    url: '/dashboard/getPanelCount', // 获取统计数据
    method: 'get',
  })
}
