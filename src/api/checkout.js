import request from '@/utils/request'
import qs from 'qs'
// 获取订单列表
export function getCheckOutList(query) {
  return request({
    url: '/registrationOrder/checkOutList',
    method: 'get',
    params: query
  })
}
// 退房按钮
export function checkOut(data, timestamp, balance) {
  return request({
    url: '/registrationOrder/checkOut/' + timestamp + '/' + balance,
    method: 'post',
    data
  })
}
// 根据type获取字典表数据
export function getBillTypeList(type) {
  return request({
    url: '/dict/more/' + type,
    method: 'get',
    withCredentials: false
  })
}
// 添加账务
export function addBillDetail(data, timestamp) {
  return request({
    url: '/billdetail/addBillDetail/' + timestamp,
    method: 'post',
    data
  })
}
// 根据code获取字典表数据详情
export function queryBill(data) {
  return request({
    url: '/dict/info/' + data,
    method: 'get'
  })
}
// 根据code获取pcode=code的数据
export function getBillPcode(code) {
  return request({
    url: '/dict/getDict/' + code,
    method: 'get'
  })
}
// 获取balance金额
export function getBalance(data, timestamp) {
  return request({
    url: '/billdetail/getBillDetail/' + timestamp,
    method: 'post',
    data
  })
}
// 获取消费品列表
export function getConsumerGood(data) {
  return request({
    url: '/consumergoods/list',
    method: 'get',
    params: data
  })
}
// 插入消费品详细表
export function addConsumerDetail(data) {
  return request({
    url: '/consumergoodsdetail/add',
    method: 'post',
    data
  })
}
// 获取订单详细数据
export function getOrderInfo(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/registrationOrder/getOrderInfo',
    method: 'post',
    data
  })
}
// 更新订单数据
export function updateOrderInfo(data) {
  data = qs.stringify(data, { arrayFormat: 'brackets' })
  return request({
    url: '/registrationOrder/updateOrderInfo',
    method: 'post',
    data
  })
}
// 退款重试
export function retryRefund(data) {
  return request({
    url: '/registrationOrder/retryRefund',
    method: 'post',
    data
  })
}
// 获取入住即将到期订单
export function getmaturityOrderList(query) {
  return request({
    url: '/registrationOrder/maturityOrder',
    method: 'get',
    params: query
  })
}
// 获取超期退款订单
export function getRefundOverdueOrder(query) {
  return request({
    url: '/registrationOrder/overdueorder',
    method: 'get',
    params: query
  })
}
// 根据入住单主键查询订单
export function getRegistrationOrderById(pk_ci_id) {
  return request({
    url: '/registrationOrder/orderInfo/' + pk_ci_id,
    method: 'get'
  })
}
// 根据入住单主键查询消费品明细
export function getConsumerGoodsDetailById(pk_ci_id) {
  return request({
    url: '/consumergoodsdetail/consumerInfo/' + pk_ci_id,
    method: 'get'
  })
}
// 根据入住单主键查询账单明细
export function getbillDetailById(pk_ci_id) {
  return request({
    url: '/billdetail/billDetailInfo/' + pk_ci_id,
    method: 'get'
  })
}
// 根据入住单主键查询同住人信息
export function getHousemateList(pk_ci_id) {
  return request({
    url: '/housemate/list/' + pk_ci_id,
    method: 'get'
  })
}
// 根据入住单主键查询交易明细信息
export function getTradingDetail(pk_ci_id) {
  return request({
    url: '/payment/paymentInfo/' + pk_ci_id,
    method: 'get'
  })
}
// 根据入住单主键查询订单操作日志
export function getOperateLogById(pk_ci_id) {
  return request({
    url: '/operateLog/operateLogInfo/' + pk_ci_id,
    method: 'get'
  })
}
// 订单详情信息
export function getOrderDetailsInfo(pk_ci_id) {
  return request({
    url: '/registrationOrder/getOrderDetails/' + pk_ci_id,
    method: 'get'
  })
}
// 最近退房
export function getRecentlyCheckOut(query) {
  return request({
    url: 'registrationOrder/recentlyCheckOut',
    method: 'get',
    params: query
  })
}

// 切换离线退房模式
export function switchover(data) {
  return request({
    url: 'registrationOrder/switchover',
    method: 'post',
    data
  })
}

// 离线模式添加账务
export function offLineAddBillDetail(data) {
  return request({
    url: 'billdetail/offLineAddBillDetail',
    method: 'post',
    data
  })
}

// 离线模式退房
export function offLineCheckOut(data) {
  return request({
    url: 'registrationOrder/offLineCheckOut',
    method: 'post',
    data
  })
}

// 离线模式查询账务
export function offLineGetBillDetail(data) {
  return request({
    url: 'billdetail/offLineGetBillDetail',
    method: 'post',
    data
  })
}
