<!--
* @description 二级分类展示商品item
* @fileName goods-item.vue
* @author echo9z
* @date 2022/06/28 19:50:44
!-->
<template>
  <!-- 单个商品 -->
  <RouterLink :to="`/product/${goods.id}`" class='goods-item'>
    <img :src="goods.picture" alt="">
    <p class="name ellipsis">{{goods.name}}</p>
    <p class="desc ellipsis">{{goods.desc}}</p>
    <p class="price">&yen;{{goods.price}}</p>
  </RouterLink>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CategoryGoodsItem',

  components: {},

  props: {
    goods: {
      type: Object,
      default: () => {}
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
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  .hoverShadow();
  img {
    width: 160px;
    height: 160px;
  }
  p {
    padding-top: 10px;
  }
  .name {
    font-size: 16px;
  }
  .desc {
    color: #999;
    height: 29px;
  }
  .price {
    color: @priceColor;
    font-size: 20px;
  }
}
</style>
