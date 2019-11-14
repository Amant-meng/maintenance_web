import request from '@/utils/request'

export function login(username, password, imgcode) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password,
      imgcode
    }
  })
}

export function getInfo() {
  return request({
    url: '/main',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
