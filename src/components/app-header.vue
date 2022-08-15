<!--
* @description 头部导航栏 一级菜单等等
* @fileName app-header.vue
* @author echo9z
* @date 2022/06/17 11:15:57
!-->
<template>
  <header class='app-header'>
    <div class="container">
      <!-- logo部分 -->
      <h1 class="logo"><router-link to="/">小兔鲜</router-link></h1>
      <!-- 导航 一级的导航，导航栏封装成组件使用 -->
      <AppHeaderLevel1 />
      <!-- 搜索 -->
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 头部购物车组件 -->
      <AppHeaderCart />
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import AppHeaderLevel1 from './app-header-nav.vue'
import AppHeaderCart from './app-header-cart.vue'
export default defineComponent({
  name: 'AppHeader',
  components: {
    AppHeaderLevel1,
    AppHeaderCart
  }
})
</script>

<style scoped lang='less'>
.app-header {
  background: #fff;
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(../assets/images/logo.png) no-repeat center 18px / contain;
    }
  }
  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
}
</style>
