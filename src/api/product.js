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
