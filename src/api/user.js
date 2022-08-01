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

/**
 * QQ登录
 * @param {String} unionId QQ返回的QQ号的身份的唯一标识
 * @param {Integer} source 注册来源 注册来源，1为pc 默认为1
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'POST', { unionId, source })
}

/**
 * 三方登录_QQ登录账号绑定 通过qq号登录，已经有本平台账号
 */
export const userQQLoginBind = (unionId, source = 1) => {
  return request('/login/social/', 'POST', { unionId, source })
}

/**
 * 获取第三方QQ登录时，获取code短信验证码请求
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userQQLoginBindMsg = (mobile) => {
  return request('/login/social/code', 'GET', { mobile })
}
/**
 * 三方登录_账号与QQ绑定
 * @param {String} unionId - QQ号的身份的唯一标识
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userQQLoginMobileBind = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'POST', { unionId, mobile, code })
}
/**
 * 注册-校验用户名唯一
 * @param {String} account 用户名或手机号
 * @returns Promise
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'GET', { account })
}
/**
 * 获取短信验证码-注册-PC
 * @param {*} mobile - 手机号
 * @returns Promise
 */
export const userAccountRegisterMsg = (mobile) => {
  return request('/register/code', 'GET', { mobile })
}

/**
 * 三方QQ登录-完善信息
 * @param {*} unionId - QQ号的身份的唯一标识
 * @param {String} account - 用户名或手机号
 * @param {String} password - 密码
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userAccountCompleteInfo = ({ unionId, account, password, mobile, code }) => {
  return request(`/login/social/${unionId}/complement`, 'POST', { account, password, mobile, code })
}
