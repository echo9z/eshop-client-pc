// 用户相关的接口

import request from '@/utils/request'

/**
 * 用户登录
 * @param {String} account - 用户名或手机号
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'POST', { account, password })
}

/**
 * 用户获取短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'GET', { mobile })
}

/**
 * 短信验证码登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'POST', { mobile, code })
}
