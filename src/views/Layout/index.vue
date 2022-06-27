<!--
* @description 视图展示页面，所有组件像一级路由会在当前Layout展示
* @fileName index.vue
* @author echo9z
* @date 2022/06/16 11:30:17
!-->
<template>
  <!-- 顶部通栏 -->
  <AppNavbar />
  <!-- 吸顶头部组件 -->
  <AppHeaderSticky />
  <!-- 头部组件 -->
  <AppHeader />
  <!-- main主体内容 -->
  <div class="app-main">
    <!-- 二级路由出口 商品分类 商品详细 个人中心啊，订单管理啊等等组件-->
    <router-view></router-view>
  </div>
  <!-- 底部组件 -->
  <AppFooter />
</template>

<script>
import { defineComponent } from 'vue'
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'LayoutPage',

  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },

  props: {},

  setup () {
    // 获取分类数据，供其他页面使用数据
    const store = useStore()
    // 调用action中获取分类数据
    store.dispatch('category/getList')
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.app-main{
  min-height: 600px;
}
</style>
