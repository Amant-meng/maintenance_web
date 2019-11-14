import request from '@/utils/request'

export function getAdvancedOrderList(query) {
  return request({
    url: '/advancedOrder/list',
    method: 'get',
    params: query
  })
}

export function addAdvancedOrder(data) {
  return request({
    url: '/advancedOrder/add',
    method: 'post',
    data
  })
}

export function payAdvancedOrder(or_id) {
  return request({
    url: '/advancedOrder/pay/' + or_id,
    method: 'post'
  })
}
export function cancleAdvancedOrder(data) {
  return request({
    url: '/advancedOrder/cancel',
    method: 'post',
    data
  })
}

