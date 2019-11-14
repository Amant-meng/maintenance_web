import request from '@/utils/request'
import qs from 'qs'
export function getBillDetails(query) {
  return request({
    url: '/report/billDetails',
    method: 'get',
    params: query
  })
}

export function exportBillDetails(data) {
  data = qs.stringify(data)
  return request({
    url: '/report/exportBillDetails',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    },
    data
  })
}

export function getSummarybillDetails(query) {
  return request({
    url: '/report/summarybillDetails',
    method: 'get',
    params: query
  })
}

export function exportSummaryBillDetails(data) {
  data = qs.stringify(data)
  return request({
    url: '/report/exportSummaryBillDetails',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data
  })
}

export function getStatisticsList(query) {
  return request({
    url: '/export/getStatisticsList',
    method: 'get',
    params: query
  })
}

export function getCollectRefoundList(query) {
  return request({
    url: '/export/getCollectRefoundList',
    method: 'get',
    params: query
  })
}

export function getTopData(query) {
  return request({
    url: '/export/getTopData',
    method: 'get',
    params: query
  })
}

export function getDetailedList(query) {
  return request({
    url: '/export/getDetailedList',
    method: 'get',
    params: query
  })
}

export function getAccountingDetailedList(query) {
  return request({
    url: '/export/getAccountingDetailedList',
    method: 'get',
    params: query
  })
}

export function getHotelList(id) {
  return request({
    url: 'http://139.159.140.8:8080/api/v1/terminalconfig/hotellist/' + id,
    method: 'get',
    withCredentials: false
  })
}

export function getBlockList() {
  return request({
    url: 'http://139.159.140.8:8080/api/v1/terminalconfig/bloclist.json',
    method: 'get',
    withCredentials: false
  })
}

