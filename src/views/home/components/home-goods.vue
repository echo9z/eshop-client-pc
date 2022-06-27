<!--
* @description 单个商品item组件
* @fileName home-goods.vue
* @author echo9z
* @date 2022/06/24 14:55:40
!-->
<template>
  <div class="goods-item">
    <!-- 单个商品图片 -->
    <RouterLink :to="`/product/${goods.id}`" class="image">
      <img v-lazy="goods.picture" alt="" />
    </RouterLink>
    <!-- 商品的名称  ellipsis文字一行 出现三个省略号 -->
    <p class="name ellipsis-2">{{goods.name}}</p>
    <p class="desc ellipsis">{{goods.desc}}</p>
    <p class="price">&yen;{{goods.price}}</p>
    <!-- 鼠标进入是显示extra层 -->
    <div class="extra">
      <RouterLink to="/">
        <span>找相似</span>
        <span>发现现多宝贝 &gt;</span>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomeGoods',

  components: {},

  props: {
    goods: {
      type: Object,
      default: () => {} // 默认是一个空对象
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.goods-item {
  width: 240px;
  height: 300px;
  padding: 10px 30px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all .5s;
  .image {
    display: block;
    width: 160px;
    height: 160px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    margin-top: 6px;
    font-size: 16px;
    text-align: center;
    &.name {
      height: 44px;
    }
    &.desc {
      color: #666;
      height: 22px;
    }
    &.price {
      margin-top: 10px;
      font-size: 20px;
      color: @priceColor;
    }
  }
  .extra {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 86px;
    width: 100%;
    background: @xtxColor;
    text-align: center;
    transform: translate3d(0,100%,0); // 默认extra的相似层为在整个goods-item容器的外部，整个goods-item容器添加了溢出隐藏，添加translate3d(0,100%,0)，让extra容器向下移动自身高度
    transition: all .5s;
    span {
      display: block;
      color: #fff;
      width: 120px;
      margin: 0 auto;
      line-height: 30px;
      &:first-child {
        font-size: 18px;
        border-bottom:1px solid #fff;
        line-height: 40px;
        margin-top: 5px;
      }
    }
  }
  &:hover {
    border-color: @xtxColor;
    .extra { // 通过hover鼠标进入，将transform3d效果溢出，还原到原理的位置
      transform: none;
    }
  }
}
</style>
