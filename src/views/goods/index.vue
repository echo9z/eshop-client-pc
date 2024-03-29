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
          <GoodsSales />
        </div>
        <!-- 商品信息介绍 -->
        <div class="spec">
          <GoodsName :goods="goods"/>
          <!-- skuId:根据传入的id值，自动选择商品规格 -->
          <GoodsSku :goods="goods" :skuId="'1369155863389933570'" @change="changeSku"/>
          <!-- 商品数量组件 -->
          <ENumBox v-model="num" :max="goods.inventory" label="数量" />
          <!-- 按钮组件 -->
          <EButton @click="insertCart" type="primary" style="margin-top: 20px;" size="large" >加入购物车</EButton>
        </div>
      </div>
      <!-- 商品推荐 一个小轮播图 -->
      <GoodsRelevant :goodsId="id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, watch, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import { findGoods } from '@/api/product'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import EButton from '@/components/library/e-button.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
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
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, EButton, GoodsTabs, GoodsHot, GoodsWarn },
  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },

  setup (props) {
    // 1. 获取商品详情，进行面包屑渲染
    const goods = useGoods(props)

    // 取得sku 对象信息
    const currSku = ref({})
    const changeSku = (sku) => {
      console.log(sku)
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku // 记录用户点击的sku数据，也可能没有选中完整商品规格，返回的是一个空{}对象
    }

    // 通过vue3中依赖注入 provide函数
    provide('goods', goods)
    // 商品的选择数量
    const num = ref(1)

    const store = useStore()
    // 添加到购物车
    const insertCart = () => {
      // 约定加入购物车字段必须和后端保持一致
      // id skuId name picture attrsText price nowPrice selected stock count isEffective
      if (currSku.value && currSku.value.skuId) {
        console.log(1)
        const { id, name, price, mainPictures } = goods.value
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        store.dispatch('cart/insertCart', {
          id,
          name,
          price, // 根据选中的商品计算出的价格
          nowPrice: price, // 现价
          picture: mainPictures[0],
          selected: true, // 默认购物车是勾选状态
          count: num.value,
          isEffective: true, // 商品是否有效，即商品是否有库存
          skuId,
          stock,
          attrsText
        }).then(() => { // 这里可以then原因是insertCart中通过resolve函数
          Message({ type: 'success', text: '加入购物车成功' })
        })
      } else {
        Message({ text: '请选择完整的商品规格' })
      }
      console.log(2)
    }

    return {
      goods,
      changeSku,
      num,
      insertCart
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
