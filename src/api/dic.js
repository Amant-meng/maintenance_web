import request from '@/utils/request'
export function getDic(dic) {
  return request({
    url: '/dict/info/' + dic,
    method: 'get'
  })
}

export function getDicMore(dicS) {
  return request({
    url: '/dict/more/' + dicS,
    method: 'get'
  })
}
