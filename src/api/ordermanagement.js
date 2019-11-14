import request from '@/utils/request'

export function getAllOrderList(query) {
  return request({
    url: '/registrationOrder/allOrderList',
    method: 'get',
    params: query
  })
}

