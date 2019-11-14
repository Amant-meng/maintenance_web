import request from '@/utils/request'
export function getMenuList() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

export function getMenuInfo(id) {
  return request({
    url: '/menu/info/' + id,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/edit',
    method: 'post',
    data
  })
}
export function deleteMenu(id) {
  return request({
    url: '/menu/del/' + id,
    method: 'delete'
  })
}
