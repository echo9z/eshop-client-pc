import request from '@/utils/request'
// 会员中心相关接口 足迹 收藏 等等
/**
 * 获取收藏分页数据
 * @param {Integer} page 页码
 * @param {Integer} pageSize 页尺寸
 * @param {Integer} collectType 收藏类型，1为商品，2为专题，3为品牌
 * @returns Promise
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}
