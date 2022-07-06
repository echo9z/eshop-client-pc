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
/**
 * 获取二级类目，分类下包含商品筛选项
 * @param {String} id 二级类目ID
 * @returns Promise
 */
export const findSubCategory = (id) => {
  return request('/category/sub/filter', 'GET', { id })
}
/**
 * 获取二级分类下的数据商品
 * @param {Object} body
 * inventory: false, // 显示有库存商品，默认不显示 右侧复选框按钮
 * onlyDiscount: false, // 显示特惠商品
 * sortField：
 *  - publishTime：最新发布商品
 *  - orderNum：订单排序 最高人气
 *  - evaluateNum：评论最多排序
 *  - price：价格排序
 *      - sortField: null, // 默认没有设置排序规则
 *      - sortMethod: null // 传入商品价格，排序规则，asc为正序，desc为倒序，默认为desc
 * sortMethod：asc 和 desc，不传默认desc
 * @returns Promise
 */
export const findSubCategoryGoods = body => {
  return request('/category/goods/temporary', 'POST', body)
}
