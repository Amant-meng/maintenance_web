import request from '@/utils/request'
import qs from 'qs'
export function getRoleList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function getRoleInfo(id) {
  return request({
    url: '/role/info/' + id,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/del/' + id,
    method: 'delete'
  })
}
export function getRolePrem(id) {
  return request({
    url: '/menu/role/' + id,
    method: 'get'
  })
}
export function updateRolePrem(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/role/prem',
    method: 'post',
    data
  })
}
