import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { // 二级路由布局容器 渲染个人中心 和 订单管理等等
        path: '/',
        component: () => import('@/views/home') // home页面用于展示渲染个人中心 和 订单管理等等
      },
      { // 一级分类 比如美食
        path: '/category/:id',
        component: () => import('@/views/category'),
        props: true // 动态路由传递参数，将id在映射到组件中props属性使用，方便维护使用
      },
      { // 二级分类 比如美食分类下的 调味酱菜
        path: '/category/sub/:id',
        component: () => import('@/views/category/subcategory'),
        props: true
      },
      { // 商品路由
        path: '/product/:id',
        component: () => import('@/views/category/subcategory'),
        props: true
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
