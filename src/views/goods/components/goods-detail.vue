<!--
* @description 商品详情组件 比如图片，介绍等等
* @fileName goods-detail.vue
* @author echo9z
* @date 2022/07/12 19:57:02
!-->
<template>
  <div class="goods-detail">
    <!-- 属性 -->
    <ul class="attrs">
      <!-- 商品属性的描述，功能 成分 产地啊 -->
      <li v-for="(item,i) in goods.details.properties" :key="i">
        <span class="dt">{{item.name}}</span>
        <span class="dd">{{item.value}}</span>
      </li>
    </ul>
    <!-- 商品图片预览介绍 -->
    <img v-for="(imgUrl,index) in goods.details.pictures" :key="index" :src="imgUrl" alt="">
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue'
export default defineComponent({
  name: 'GoodsDetail',

  components: {},

  props: {
  },

  setup () {
    const goods = inject('goods')
    return {
      goods
    }
  }
})

</script>
<style lang='less' scoped>
.goods-detail {
  padding: 40px;
  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%; // 一行占两个li元素
      .dt {
        width: 100px;
        color: #999;
      }
      .dd {
        flex: 1;
        color: #666;
      }
    }
  }
  > img {
    width: 100%;
  }
}
</style>
