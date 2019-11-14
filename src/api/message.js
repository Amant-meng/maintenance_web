import request from '@/utils/request'
export function getMessageList(query) {
  return request({
    url: '/message/sysMessageList',
    method: 'get',
    params: query
  })
}

export function updateMessage(data) {
  return request({
    url: '/message/update',
    method: 'post',
    data
  })
}

export function updateMessagelist() {
  return request({
    url: '/message/updatelist',
    method: 'post',
    data: {}
  })
}
