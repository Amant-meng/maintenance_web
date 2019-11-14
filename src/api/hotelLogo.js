import request from '@/utils/request'

export function getHotelLogo(query) {
  return request({
    url: 'hotelLogo/getHotelLogo',
    method: 'get',
    params: query
  })
}
