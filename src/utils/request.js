// 1. 创建一个axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1.剥离无效数据 2. 处理token失效
// 4. 导出一函数，调用当前的axios实例发请求，返回值为promise

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios 的一些配置
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use((config) => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 在请求时，在请求头中添加token
  const { profile } = store.state.user
  // 判断是否有token
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  // 错误的处理
  return Promise.reject(err)
})

// 处理服务器返回的数据，一般axios返回的数据对象response对象，剥削无效的数据
// 将来调用的时候直接是后台返回的数据
instance.interceptors.response.use(res => {
  return res.data
}, err => {
  // 错误的处理
  // 比如401 状态码是返回无效的token，做一些token的逻辑
  if (err.response && err.response.status === 401) { // err.response排除无响应情况
    // 处理 401 事件
    // 1.清空本地无效信息
    // 2.跳转值登录页
    // 3.跳转是需要携带参数（当前页面的路由地址）给登录，用户登录后根据携带参数跳转至原来页面
    store.commit('user/setUser', {})
    // 在组件中的 url是’/user?a=10‘ $route.path = '/user'  $route.fullPath === user?a=10 $route当前路由的信息
    // router.currentRoute也是当前路由的信息 router.currentRoute.fullPath === user?a=10，这里是ref包装的得使用.value
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath) // 这里为什么需要转码，原因是/user?a=10&b=5 像&符合就是一个特殊字符，转码后会出现%214%那种转码的字符比如在某些网站请求url地址
    /** encodeURIComponent 转换url编码，防止解析地址出现问题，比如等值会出现特殊字符
     * > encodeURIComponent('?a=100&b=20')
        '%3Fa%3D100%26b%3D20'
     */
    router.push({ path: '/login', query: { redirectUrl: fullPath } }) // login?redirectUrl=当前路由地址
  }
  return Promise.reject(err)
})

// 请求工具函数，负责发送请求
const request = (url, method, submitData) => {
  // 负责发送请求: 请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 如果是get请求，使用params参数，如果是post使用data参数
    // 比如 a = {num:10} a.num 或者 a['num']，此时中括号可以写js表达式 a[ a>0?'num1':'num2]
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}

export default request
