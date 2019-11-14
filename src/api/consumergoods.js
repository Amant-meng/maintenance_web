import request from '@/utils/request'

export function getConsumergoodsList(query) {
  return request({
    url: '/consumergoods/list',
    method: 'get',
    params: query
  })
}

export function getConsumergoodsInfo(con_seriesnum_id) {
  return request({
    url: '/consumergoods/info/' + con_seriesnum_id,
    method: 'get'
  })
}

export function addConsumergoods(data) {
  return request({
    url: '/consumergoods/add',
    method: 'post',
    data
  })
}

export function updateConsumergoods(data) {
  return request({
    url: '/consumergoods/update',
    method: 'post',
    data
  })
}
export function delConsumergoods(con_seriesnum_id) {
  return request({
    url: '/consumergoods/del/' + con_seriesnum_id,
    method: 'delete'
  })
}

