<!--
* @description 所有商品板块组件
* @fileName home-product.vue
* @author echo9z
* @date 2022/06/24 15:00:22
!-->
<template>
  <div class="home-product" ref="target">
    <!-- 使用home面，共4个 面板，主标题为一级分类 -->
    <HomePanel :title="cate.name" v-for="cate in goods" :key="cate.id">
      <!-- 右侧插槽 -->
      <template v-slot:right>
        <div class="sub">
          <RouterLink v-for="sub in cate.children" :key="sub.id" :to="`/category/sub/${sub.id}`">{{sub.name}}</RouterLink>
        </div>
        <!-- 更多 一级分类跳转 -->
        <EMore :path="`/category/${cate.id}`" />
      </template>
      <!-- 默认插槽插入位置 产品盒子 -->
      <div class="box" >
        <!-- 产品内容的左侧图片 和 文字 -->
        <RouterLink class="cover" :to="`/category/${cate.id}`">
        <!-- 使用图片懒加载 -->
          <img v-lazy="cate.picture" alt="">
          <strong class="label">
            <span>{{cate.name}}馆</span>
            <span>{{cate.saleInfo}}</span>
          </strong>
        </RouterLink>
        <!-- 右侧8个商品item组件 -->
        <ul class="goods-list">
          <li v-for="goods in cate.goods" :key="goods.id">
            <HomeGoods :goods="goods" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeGoods from './home-goods.vue'
import { useLazyData } from '@/hooks'
import { findProduct } from '@/api/home'
export default defineComponent({
  name: 'HomeProduct',

  components: {
    HomePanel,
    HomeGoods
  },

  props: {},

  setup () {
    // 数据懒加载方式
    const target = ref(null) // 获取观察的dom
    const goods = useLazyData(target, findProduct)
    return {
      target,
      goods
    }
  }
})

</script>
<style lang='less' scoped>
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover; // css3 图片进行平铺
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0,-50%,0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0,0,0,.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0,0,0,.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n+4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
