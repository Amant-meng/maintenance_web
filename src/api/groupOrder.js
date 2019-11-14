import request from '@/utils/request'
export function getHotelGroupOrderList(params) {
  return request({
    url: '/merchant/getHotelGroupOrderList',
    method: 'get',
    params
  })
}

export function getTeamOrderInfo(params) {
  return request({
    url: '/merchant/getTeamOrderInfo',
    method: 'get',
    params
  })
}

export function getLeaderInfo(params) {
  return request({
    url: '/merchant/getLeaderInfo',
    method: 'get',
    params
  })
}

export function groupOrderToLeader(data) {
  return request({
    url: '/merchant/groupOrderToLeader',
    method: 'post',
    data
  })
}

export function deleteTeamInfo(params) {
  return request({
    url: '/merchant/deleteTeamInfo',
    method: 'get',
    params
  })
}

export function updatePayRule(data) {
  return request({
    url: '/merchant/updatePayRule',
    method: 'post',
    data
  })
}
