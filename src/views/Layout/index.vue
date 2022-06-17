<!--
* @description 视图展示页面，所有组件像一级路由会在当前Layout展示
* @fileName index.vue
* @author echo9z
* @date 2022/06/16 11:30:17
!-->
<template>
  <!-- 顶部通栏 -->
  <AppNavbar />
  <!-- 头部组件 -->
  <AppHeader />
  <!-- main主体内容 -->
  <div class="main">
    <!-- 二级路由出口 个人中心啊，订单管理啊等等-->
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
export default defineComponent({
  name: 'LayoutPage',

  components: {
    AppNavbar,
    AppHeader,
    AppFooter
  },

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
