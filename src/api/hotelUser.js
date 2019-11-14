import request from '@/utils/request'
import qs from 'qs'
export function getUserList(query) {
  return request({
    url: '/hotel/user/list',
    method: 'get',
    params: query
  })
}

export function getUserInfo(id) {
  return request({
    url: '/hotel/user/info/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/hotel/user/add',
    method: 'post',
    data
  })
}

export function checkUser(data) {
  data = qs.stringify(data)
  return request({
    url: '/check',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/hotel/user/update',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/hotel/user/del/' + id,
    method: 'delete'
  })
}
export function getUserPrem(id) {
  return request({
    url: '/role/user/' + id,
    method: 'get'
  })
}
export function updateUserPrem(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/hotel/user/prem',
    method: 'post',
    data
  })
}

