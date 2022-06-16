import { createStore } from 'vuex'
// 数据持久化插件
import createPersistedstate from 'vuex-persistedstate'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置持久插件
  plugins: [
    // 默认存储在localStorage中
    createPersistedstate({
      key: 'eshop-store', // 本地存储名字
      paths: ['user', 'cart'] // 指定需要存储的模块
    })
  ]
})
