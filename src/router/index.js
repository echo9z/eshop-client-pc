import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { // 二级路由布局容器 渲染个人中心 和 订单管理等等
        path: '/',
        component: () => import('@/views/home')
      }
    ]
  }
]

// vue2.0 const router = VueRouter({}) 创建路由实例
// vue3.0 createRouter({})
const router = createRouter({
  history: createWebHashHistory(), // 使用历史hash路由模式
  routes
})

export default router
