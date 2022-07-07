<!--
* @description 商品详情组件，点击商品根据路由传参，接收商品id
* @fileName index.vue
* @author echo9z
* @date 2022/06/22 16:41:20
!-->
<template>
  <div class='e-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <EBread v-if="goods.categories">
        <EBreadItem to="/">首页</EBreadItem>
        <EBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</EBreadItem>
        <EBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</EBreadItem>
        <EBreadItem >{{goods.name}}</EBreadItem>
      </EBread>
      <!-- 商品信息 商品价格，尺寸，图片等等 -->
      <div class="goods-info">
        <!-- 商品图片展示 -->
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
        </div>
        <!-- 商品信息介绍 -->
        <div class="spec"></div>
      </div>
      <!-- 商品推荐 一个小轮播图 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">商品+评价</div>
          <!-- 注意事项 -->
          <div class="goods-warn">注意事项</div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">24热榜+专题推荐 </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from 'vue'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import { findGoods } from '@/api/product'

const useGoods = (props) => {
  const goods = ref(null)
  // 路由地址商品id发生变化，但不会重新初始化组件，通过监听在处理
  watch(() => props.id, (newVal) => {
    // if (newVal && `/products/${newVal}` === route.path) {
    if (newVal) {
      findGoods(props.id).then(res => {
        console.log(res)
        // 每次在更换数据的使用，让其他的组件重新初始化渲染
        // 商品的数据null以后，使用v-if的组件可以重新销毁和创建
        goods.value = null // 这里的代码意思，如果id变化，发送请求，第一次没有goods属性，通过v-if控制组件的创建，此时赋值goods组件初始化完毕，第二访问其他商品goods只是重新赋值，赋值给goods组件时不会重新创建并初始的
        nextTick(() => {
          goods.value = res.result
        })
      })
    }
  }, { immediate: true })
  return goods
}
export default defineComponent({
  name: 'EGoodsPage',
  components: { GoodsRelevant, GoodsImage },
  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },

  setup (props) {
    // 1. 获取商品详情，进行面包屑渲染
    const goods = useGoods(props)
    return {
      goods
    }
  }
})

</script>
<style lang='less' scoped>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
