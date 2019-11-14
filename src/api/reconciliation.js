import request from '@/utils/request'
export function getCompareList(query) {
  return request({
    url: '/file/comparisonResult',
    method: 'get',
    params: query
  })
}

export function getDetailsCompareList(query) {
  return request({
    url: '/file/comparisonBillDetailsResult',
    method: 'get',
    params: query
  })
}
