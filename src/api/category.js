import request from '@/utils/request'

// 定义分类相关的api接口函数
/**
 * 获取所有分类（顶一级，二级，以及对应的商品推荐商品推荐数据）
 * @returns Promise
 */
export const findCategory = () => {
  return request('/home/category/head', 'GET')
}
