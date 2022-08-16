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
