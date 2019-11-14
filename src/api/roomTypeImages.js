import request from '@/utils/request'
// import qs from 'qs'

// 获取酒店房型列表
export function getRoomTypeImagesList(timestamp) {
  return request({
    url: '/roomimg/findAllRoomType?timestamp=' + timestamp,
    method: 'get'
  })
}

// 更新酒店最大入住人数
export function updateRoomMaxCheckInNum(imgId, maxNum) {
  return request({
    url: '/roomimg/updateRoomMaxCheckInNum?imgId=' + imgId + '&maxNum=' + maxNum,
    method: 'get'
  })
}

// 查询房型所有房间及别名
export function findAllRoomByRoomType(roomTypeCode, timestamp) {
  return request({
    url: '/roomimg/findAllRoomByRoomType?roomTypeCode=' + roomTypeCode + '&timestamp=' + timestamp,
    method: 'get'
  })
}

// 保存房间别名配置
export function saveRoomAnotherName(list) {
  return request({
    url: '/roomimg/saveRoomAnotherName',
    method: 'post',
    data: list,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新押金配置
export function updateRoomTypeDeposit(roomtype_deposit, roomTypeCode, deposit_off) {
  return request({
    url: '/roomimg/updateRoomTypeDeposit?roomtype_deposit=' + roomtype_deposit + '&roomTypeCode=' + roomTypeCode + '&deposit_off=' + deposit_off,
    method: 'get'
  })
}

// 单独配置开关打开
export function updateDepositOff(roomtype_deposit, deposit_off) {
  return request({
    url: '/roomimg/updateDeposit_off?roomtype_deposit=' + roomtype_deposit + '&deposit_off=' + deposit_off,
    method: 'get'
  })
}
