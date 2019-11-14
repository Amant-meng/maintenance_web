import request from '@/utils/request'
import qs from 'qs'
// 获取订单列表
export function getCheckOutList(query) {
  return request({
    url: '/registrationOrder/checkOutList',
    method: 'get',
    params: query
  })
}
// 打印小票
export function getPrintTicket(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/printTicket',
    method: 'post',
    data
  })
}
