/**
 * 订单相关api
 */
import request from '@/utils/request'

/**
* 结算页面-创建订单 根据选中的商品创建订单
* @param {String} cancelReason - 去洗商品
* @returns Promise
*/
export const createdOrder = (cancelReason) => {
  return request('/member/order/pre', 'GET', { cancelReason })
}
/**
 * 添加收货地址
 * @param {Object} form - 添加收货地址 表单对象
 * @returns Promise
 */
export const addAddress = (form) => {
  return request('/member/address', 'POST', form)
}
/**
 * 修改收货地址
 * @param {Object} form - 修改收货地址
 * @returns Promise
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'PUT', form)
}
/**
 * 提交订单
 * @param {Object} order
 * @returns Promise
 */
export const submitOrder = (order) => {
  return request('/member/order', 'POST', order)
}
