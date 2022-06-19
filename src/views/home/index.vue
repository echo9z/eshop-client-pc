<!--
* @description 展示渲染一级分类商品 二级商品  main中（显示个人中心 和 订单管理）等等，可以理解为中间主体区域会变化，该组件徽标渲染到Layout下main中二级路由出口
* @fileName index.vue
* @author echo9z
* @date 2022/06/16 11:29:17
!-->
<template>
  <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
    </div>
    <!--  -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import HomeCategory from './components/home-category.vue'
export default defineComponent({
  name: 'HomePage',

  components: {
    HomeCategory
  },

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
// @import '@/assets/styles/mixin.less';
.test{
  .hoverShadow();
  width: 100px;
  height: 100px;
}
</style>
