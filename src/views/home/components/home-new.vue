<!--
* @description 获取新鲜好物
* @fileName home-new.vue
* @author echo9z
* @date 2022/06/22 16:24:35
!-->
<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱" >
      <template #right>
        <EMore path="/" />
      </template>
      <div ref="news" style="position: relative; height: 406px;">
        <transition name="fade">
          <!-- 面板内容 默认插槽 如果list数据存在，显示ul下数据 -->
          <ul v-if="goods.length" class="goods-list">
            <!-- 循环遍历goods数据 -->
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
              </RouterLink>
            </li>
          </ul>
          <!-- 如果没有获取到list数据，显示骨架屏效果，让用户有更好的体验 -->
          <HomeSkeleton bg="#f0f9f4" v-else />
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'
export default defineComponent({
  name: 'HomeNew',

  components: {
    HomePanel,
    HomeSkeleton
  },

  props: {},

  setup () {
    // 获取的商品数据
    // const goods = ref([])
    // findNew().then((res) => {
    //   console.log(res)
    //   goods.value = res.result
    // })
    const news = ref(null) // 获取dom元素
    // 调用组件的数据懒加载
    const goods = useLazyData(news, findNew) // 返回的是一个ref包裹的对象
    return {
      news,
      goods
    }
  }
})

</script>
<style lang='less' scoped>
// 元素移除时的 淡出动画效果 是骨架屏组件慢慢弹出
.fade{
  &-leave{ // fade-leave 离开时没有效果
    &-active{ // fade-leave-active 这里加绝对定位
      position: absolute; // 这里为了骨架屏在覆盖在每个商品推荐li上，原因是显示骨架屏组件显示，慢慢淡出，此时lu面板数据的dom元素创建，就会出现两个元素，上面是骨架屏，下面是商品li
      width: 100%;
      transition: opacity .5s .2s;
      z-index: 1;
    }
    &-to { // fade-leave-to 离开后
      opacity: 0;
    }
  }
}
// 元素显示 淡入动画 面板的内容慢慢显示
/* .fade{
  &-enter{ // fade-enter 进入时没有效果
    &-active{ // fade-enter-active
      position: absolute;
      width: 100%;
      transition: opacity 5s .2s;
      z-index: 1;
    }
    &-from{
      opacity: 0;
    }
    &-to { // fade-enter-to 显示后透明度为1
      opacity: 1;
    }
  }
} */
.home-new{
  .goods-list {
    display: flex;
    justify-content: space-between;
    height: 406px;
    li {
      width: 306px;
      height: 406px;
      background: #f0f9f4;
      .hoverShadow();
      img {
        width: 306px;
        height: 306px;
      }
      p {
        font-size: 22px;
        padding: 12px 30px 0 30px;
        text-align: center;
      }
      .price {
        color: @priceColor;
      }
    }
  }
}
.v-enter-from .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active{// 进入中
  transition: all 2s;
}
</style>
