import request from '@/utils/request'

// 客单二维码查询
export function getGuestList(query) {
  return request({
    url: '/orderGroup/guestList',
    method: 'get',
    params: query
  })
}
// 团住二维码查询
export function getOrderGroupList(query) {
  return request({
    url: '/orderGroup/orderGroupList',
    method: 'get',
    params: query
  })
}
// 删除团单
export function delOrderGroup(or_group_id) {
  return request({
    url: '/orderGroup/del/' + or_group_id,
    method: 'delete'
  })
}
