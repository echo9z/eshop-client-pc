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
/**
 * 根据订单id 查询订单详情
 * @param {*} id - 订单id
 * @returns Promise
 */
export const findOrderDetail = (id) => {
  return request(`/member/order/${id}`, 'GET')
}
/**
 * 获取订单列表
 * @param {Integer} page 页码
 * @param {Integer} pageSize 页尺寸
 * @param {Integer} orderState 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @returns Promise
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'GET', { page, pageSize, orderState })
}
