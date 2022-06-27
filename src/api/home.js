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
/**
 * 获取轮播图数据
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'GET')
}

/**
 * 获取新鲜好物数据
 * @returns Promise
 */
export const findNew = () => {
  return request('/home/new', 'GET')
}
/**
 * 获取人气推荐数据
 * @returns Promise
 */
export const findHot = () => {
  return request('/home/hot', 'GET')
}
/**
 * 获取商品区域数据
 * @returns Promise
 */
export const findProduct = () => {
  return request('/home/goods', 'GET')
}
/**
 * 获取最新专题数据
 * @returns Promise
 */
export const findSpecial = () => {
  return request('/home/special', 'GET')
}
