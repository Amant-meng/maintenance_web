import request from '@/utils/request'
// 查询访客信息
export function getCallerInfoList(query) {
  return request({
    url: '/caller/list',
    method: 'get',
    params: query
  })
}
// 根据主键查询访客
export function getCallerInfoById(pk_id) {
  return request({
    url: '/caller/info/' + pk_id,
    method: 'get'
  })
}
// 添加访客
export function addCaller(data) {
  return request({
    url: '/caller/add',
    method: 'post',
    data
  })
}
// 更新访客
export function updateCaller(data) {
  return request({
    url: '/caller/update',
    method: 'post',
    data
  })
}
// 删除访客
export function delCaller(pk_id) {
  return request({
    url: '/caller/del/' + pk_id,
    method: 'delete'
  })
}

