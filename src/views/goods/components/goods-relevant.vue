<!--
* @description 商品推荐 和 猜你喜欢 一个小轮播图
* @fileName goods-relevant.vue
* @author echo9z
* @date 2022/07/06 11:49:37
!-->
<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId ? '同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的e-carousel.vue 轮播图组件 -->
    <ECarousel :sliders="sliders" />
  </div>
</template>

<script>
import { relevantGoods } from '@/api/product'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'GoodsRelevant',

  components: {},

  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },

  setup (props) {
    // 获取sliders的数据，提供给轮播图使用，数组长度为4，每个元素中又有 4个推荐商品对象
    // 数据结构 sliders = [[4个商品],[4个商品],[4个商品],[4个商品]]
    const sliders = ref([])
    relevantGoods({ id: props.goodsId }).then(res => {
      // console.log(res.result)
      const pageSize = 4
      const pageCount = Math.ceil(res.result.length / pageSize) // 向上取整，如果获取的奇数倍则向上取整
      // 将res.result的数据，处理赋值给sliders
      for (let i = 0; i < pageCount; i++) {
        // 第一次取数据是0 4, 4 8 依次类推
        const sliceItem = res.result.slice(pageSize * i, pageSize * (i + 1))
        // console.log(sliceItem)
        sliders.value.push(sliceItem)
      }
    })
    return {
      sliders
    }
  }
})

</script>
<style lang='less' scoped>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
// 覆盖e-carousel组件样式，跳转左右按钮位置
:deep(.e-carousel) {
  height: 380px;
  .carousel {
    &-indicator { // 中间滚动的点点点样式
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn { // 左右按钮样式
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
