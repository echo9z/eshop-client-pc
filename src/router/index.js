import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [ // 配置在children的子路由，都会在Layout.vue的  <router-view>显示
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
        component: () => import('@/views/goods'),
        props: true
      },
      {
        path: '/cart',
        component: () => import('@/views/cart')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/pay/checkout.vue')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      },
      {
        path: '/pay/callback', // 用于支付回调的页面地址
        component: () => import('@/views/member/pay/result.vue') // 支付结果页
      },
      // 个人中心页
      {
        path: '/member',
        component: () => import('@/views/member/Layout.vue'), // 支付结果页
        children: [
          {
            path: '/member', // 访问 /member 会默认重定向到home组件
            component: () => import('@/views/member/home') // 支付结果页
          },
          {
            path: '/member/order', // 订单列表
            component: { render: () => h(<RouterView />) }, // 相当于在 /member/order/index.vue中添加 RouterView路由出口
            children: [
              {
                path: '', // 订单详情
                component: () => import('@/views/member/order')
              },
              {
                path: ':id', // 订单详情
                component: () => import('@/views/member/order/detail.vue')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/callback')
  }
]

// vue2.0 const router = VueRouter({}) 创建路由实例
// vue3.0 createRouter({})
const router = createRouter({
  // history: createWebHistory(), // 使用历史history路由模式
  history: createWebHashHistory(), // 使用历史hash路由模式
  routes,
  // linkExactActiveClass: 'active', // 配置全局router 激活类名
  // 路由在进行跳转切换时，进入新的页面始终滚动到顶部
  // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
  scrollBehavior () {
    // 始终滚动到顶部
    // vu2.0 x 和 y
    // vu3.0 left 和 top
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫导航
router.beforeEach((to, from, next) => {
  // 对于以 /member 开头的 需要登录token数据
  const { profile } = store.state.user
  // token不存在， 且跳转的path路径 以 /member开头
  if (!profile.token && to.path.startsWith('/member')) {
    // to来源于地址对象
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  // 其他放行
  next()
})

export default router
