import request from '@/utils/request'

// 提供home相关接口api
/**
 * 获取品牌数据
 * @param {Integer} limit - 品牌个数
 * @returns Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'GET', { limit })
}
