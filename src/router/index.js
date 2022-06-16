import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
]

// vue2.0 const router = VueRouter({}) 创建路由实例
// vue3.0 createRouter({})
const router = createRouter({
  history: createWebHashHistory(), // 使用历史hash路由模式
  routes
})

export default router
