import request from '@/utils/request'

export function getAnnouncementList(query) {
  return request({
    url: '/SysAnnouncement/sysAnnouncementList',
    method: 'get',
    params: query
  })
}

export function addAnnouncement(data) {
  return request({
    url: '/SysAnnouncement/add',
    method: 'post',
    data
  })
}

export function getAnnouncement(id) {
  return request({
    url: '/SysAnnouncement/info/' + id,
    method: 'get'
  })
}

export function deleteAnnouncement(id) {
  return request({
    url: '/SysAnnouncement/del/' + id,
    method: 'delete'
  })
}

export function updateAnnouncement(data) {
  return request({
    url: '/SysAnnouncement/update',
    method: 'post',
    data
  })
}
