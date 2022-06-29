import request from '@/utils/request'

// 定义分类相关的api接口函数
/**
 * 获取所有分类（顶一级，二级，以及对应的商品推荐商品推荐数据）
 * @returns Promise
 */
export const findCategory = () => {
  return request('/home/category/head', 'GET')
}
/**
 * 获取一级类目，下的各个子分类，子分类包含推荐商品
 * @param {String} id 一级类目ID
 * @returns Promise
 */
export const findTopCategory = (id) => {
  return request('/category', 'GET', { id })
}
