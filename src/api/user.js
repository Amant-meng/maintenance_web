import request from '@/utils/request'
import qs from 'qs'
export function getUserList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function getUserInfo(id) {
  return request({
    url: '/user/info/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/user/add',
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
    url: '/user/update',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/user/del/' + id,
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
    url: '/user/prem',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/user/editPassword',
    method: 'post',
    data
  })
}

export function getBlockList() {
  return request({
    url: 'http://139.159.192.237:8080/api/v1/terminalconfig/bloclist.json',
    method: 'get',
    withCredentials: false
  })
}

export function getHotelList(id) {
  return request({
    url: 'http://139.159.192.237:8080/api/v1/terminalconfig/hotellist/' + id,
    method: 'get',
    withCredentials: false
  })
}
