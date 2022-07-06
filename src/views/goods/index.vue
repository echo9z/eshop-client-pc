<!--
* @description 商品详情组件，点击商品根据路由传参，接收商品id
* @fileName index.vue
* @author echo9z
* @date 2022/06/22 16:41:20
!-->
<template>
  <div class='e-goods-page'>
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/">手机</XtxBreadItem>
        <XtxBreadItem to="/">华为</XtxBreadItem>
        <XtxBreadItem to="/">p30</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 商品价格，尺寸，图片等等 -->
      <div class="goods-info"></div>
      <!-- 商品推荐 一个小轮播图 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EGoodsPage',

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
