import request from '@/utils/request'

export function countPeopleNum() {
  return request({
    url: '/registrationOrder/countPeopleNum',
    method: 'get'
  })
}
