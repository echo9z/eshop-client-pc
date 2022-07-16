<!--
* @description 商品详情 和 商品评价 切换
* @fileName goods-tabs.vue
* @author echo9z
* @date 2022/07/12 18:18:51
!-->
<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{active: activeName === 'GoodsDetail'}" href="javascript:;"
        @click="activeName = 'GoodsDetail'"
      >商品详情</a>
      <a :class="{active: activeName === 'GoodsComment'}" href="javascript:;"
        @click="activeName = 'GoodsComment'"
      >商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方: 两个组件 通过 vue内置组件 component 绑定is属性在决定component动态渲染那个组件，即组件名称 -->
    <keep-alive>
      <component :is="activeName"></component>
    </keep-alive>
    <!-- <GoodsDetail v-show="activeName === 'GoodsDetail'" />
    <GoodsComment v-show="activeName === 'GoodsComment'" /> -->
  </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue'
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
export default defineComponent({
  name: 'GoodsTabs',

  components: { GoodsDetail, GoodsComment },

  props: {
  },

  setup () {
    // 激活的那个a标签 约定activeName的值 是第一个 商品详情 GoodsDetail，第二个 GoodsComment
    const activeName = ref('GoodsDetail')
    // 通过inject 获取商品父组件index传递数据
    const goods = inject('goods')
    return {
      activeName,
      goods
    }
  }
})

</script>
<style lang='less' scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
