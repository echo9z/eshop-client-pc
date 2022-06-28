<!--
* @description 局部渲染的组件，一级分类显示的组件，比如点击美食显示美食相关内容
* @fileName index.vue
* @author echo9z
* @date 2022/06/17 16:50:31
!-->
<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <EBread>
        <EBreadItem :to="{path:'/'}" >首页</EBreadItem>
        <EBreadItem to="/category/1005002" >居家</EBreadItem>
        <EBreadItem >居家用品</EBreadItem>
      </EBread>
      <!-- 轮播图 -->
      <!-- 全部分类 -->
      <!-- 各个分类推荐商品 -->
      {{id}}
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TopCategory',

  components: {},

  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
