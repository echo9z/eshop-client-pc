import request from '@/utils/request'

// 商品相关的API函数
/**
 * 获取商品详情
 * @param {String} id - 商品ID
 * @returns Promise
 */
export const findGoods = (id) => {
  return request('/goods', 'GET', { id })
}
// 商品相关的API函数
/**
 * 获取商品同类推荐 或者 猜你喜欢
 * @param {String} id - 商品ID 传入id代表查询相关商品，不传代表查询猜你喜欢
 * @param {Integer} limit - 查询的条数16
 * @returns Promise
 */
export const relevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'GET', { id, limit })
}
/**
 * 获取商品热销推荐
 * @param {String} id 商品ID
 * @param {Integer} limit - 查询的条数
 * @param {Integer} id 热销类型 1为24小时，2为周榜，3为总榜，默认为1
 * @returns Promise
 */
export const findGoodsHot = ({ id, limit = 3, type }) => {
  return request('/goods/hot', 'GET', { id, limit, type })
}
/**
 * 查找商品评价信息
 * @param {String} id 商品ID
 * @returns Promise
 */
export const findGoodsCommentInfo = (id) => {
  // axios 遇到 https开头地址，不会加base url
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'GET')
}
/**
 * 查找商品评价列表
 * @param {String} id 商品ID
 * @param {Object} params 评论筛选条件
 * @returns Promise
 */
export const findGoodsCommentList = (id, params) => {
  // axios 遇到 https开头地址，不会加base url
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'GET', params)
}
