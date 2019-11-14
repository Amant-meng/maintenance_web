import request from '@/utils/request'
import qs from 'qs'
export function getRefundList(query) {
  return request({
    url: '/registrationOrder/refundList',
    method: 'get',
    params: query
  })
}

export function refund(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/registrationOrder/refunds',
    method: 'post',
    data
  })
}

export function fullRefunds(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/registrationOrder/fullRefunds',
    method: 'post',
    data
  })
}

export function Refund(or_id) {
  return request({
    url: '/registrationOrder/refund/' + or_id,
    method: 'post'
  })
}

export function changeRoom(data) {
  return request({
    url: '/registrationOrder/changeRoom',
    method: 'post',
    data
  })
}
