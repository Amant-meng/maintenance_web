import request from '@/utils/request'

export function getSysLogList(query) {
  return request({
    url: '/log/list',
    method: 'get',
    params: query
  })
}

export function getSysLogInfo(id) {
  return request({
    url: '/log/info/' + id,
    method: 'get'
  })
}

