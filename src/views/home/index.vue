<!--
* @description 展示渲染一级分类商品 二级商品  main中（显示个人中心 和 订单管理）等等，可以理解为中间主体区域会变化，该组件徽标渲染到Layout下main中二级路由出口
* @fileName index.vue
* @author echo9z
* @date 2022/06/16 11:29:17
!-->
<template>
    <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 层级高待遇轮播图组件 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
  <!-- 品牌推荐 -->
  <HomeBrand />
  <!-- 商品展示 -->
  <HomeProduct />
  <!-- 最新专题 -->
  <HomeSpecial />
  <!-- <button @click="show=true">显示|创建</button>
  <button @click="show=false">隐藏|移除</button>
  <transition>
    <div v-show="show" style="width: 100;height: 100px;background-color: red;"></div>
  </transition> -->
</template>

<script>
import { defineComponent } from 'vue'
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default defineComponent({
  name: 'HomePage',

  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
// vue2.0 进入 .v-enter .v-enter-active .v-enter-to
// vue3.0 进入 .v-enter-from .v-enter-active .v-enter-to
// 执行元素是由透明度0 到 1，执行过程中有2秒过渡动画
// .v-enter-from{ // 进入前
//   opacity: 0;
// }
// .v-enter-active{// 进入中
//   transition: all 2s;
// }
// .v-enter-to{ // 进入后
//   opacity: 1;
// }
// vue2.0 离开 .v-leave .v-leave-active .v-leave-to
// vue3.0 进入 .v-leave-from .v-leave-active .v-leave-to
// 隐藏 执行元素是由透明度1 到 0，执行过程中有2秒过渡动画
// .v-leave-from{ // 离开前
//   opacity: 1;
// }
// .v-leave-active{// 进入中
//   transition: all 2s;
// }
// .v-leave-to{ // 进入后
//   opacity: 0;
// }

// 下面写法可以代理上面的写法，产生效果一样
// .v-enter-from, .v-leave-to{ // 进入前 执行元素是由透明度0 到 1，执行过程中有2秒过渡动画
//   opacity: 0;
// }
// .v-enter-active, .v-leave-active{// 进入中
//   transition: all 2s;
// }

// @import '@/assets/styles/mixin.less';
// .test{
//   .hoverShadow();
//   width: 100px;
//   height: 100px;
// }
</style>
