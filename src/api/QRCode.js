import request from '@/utils/request'
import qs from 'qs'
export function getTeamList(data, timestamp) {
  return request({
    url: '/QRCode/qrSelect/' + timestamp,
    method: 'post',
    data
  })
}

export function getRoomList(data) {
  return request({
    url: '/QRCode/queryQRCode?or_group_id=' + data,
    method: 'post'
  })
}

export function getGuestList(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/queryGust',
    method: 'post',
    data
  })
}

export function split(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/split',
    method: 'post',
    data
  })
}

export function resetQRCode(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/resetQRCode',
    method: 'post',
    data
  })
}

export function saveInfo(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/saveInfo',
    method: 'post',
    data
  })
}

export function printQRCode(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/QRCode/printServer',
    method: 'post',
    data
  })
}
