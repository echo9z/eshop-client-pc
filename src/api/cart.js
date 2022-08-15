// 购物车相关的API函数
import request from '@/utils/request'
/**
 * 获取商品 最新价格 库存 以及商品是否有效
 * @param {String} id - 商品的SKU_ID
 * @returns Promise
 */
export const getNewCartGoods = (id) => {
  return request(`/goods/stock/${id}`, 'GET')
}
/**
 * 获取商品对应 Sku数据
 * @param {String} skuId - 商品的SKU_ID
 * @returns Promise
 */
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'GET')
}
/**
 * 将本地购物车合并到线上
 * @param {Array<object>} cartList 对象类型数组 skuId, selected,
 * @param {String} object.skuId - 商品的SKU_ID
 * @param {Boolean} object.selected - 选中状态
 * @param {Integer} object.count - 数量
 * @returns Promise
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'POST', cartList)
}
/**
 * 获取购物车list
 * @returns Promise
 */
export const findCart = () => {
  return request('/member/cart', 'GET')
}
/**
 * 加入购物车
 * @param {String} skuId - 商品的SKU_ID
 * @param {Integer} count - 数量
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'POST', { skuId, count })
}
/**
 * 删除/清空购物车商品
 * @param {Array<object>} ids 删除的购物车SkuId集合
 * @param {String} object.skuId - 商品的SKU_ID
 * @param {Boolean} clearAll - 是否清空，默认否
 * @param {Boolean} clearInvalid - 是否清空无效商品，默认否
 * @returns Promise
 */
export const delCart = ({ ids, clearAll, clearInvalid }) => {
  return request('/member/cart', 'DELETE', { ids, clearAll, clearInvalid })
}
/**
 * 修改购物车商品
 * @param {String} skuId - 商品的SKU_ID
 * @param {Boolean} selected - 商品的是否选中
 * @param {Integer} count - 数量
 * @returns Promise
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'PUT', { selected, count })
}
/**
 * 全选/取消全选 ids参数如果不传，表示用户访问的是全选和取消全选操作
 * @param {Boolean} selected - 商品的是否选中
 * @param {Array<object>} ids - 删除的购物车SkuId集合
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'PUT', { selected, ids })
}
