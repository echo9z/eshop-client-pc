<!--
* @description 人气推荐
* @fileName home-hot.vue
* @author echo9z
* @date 2022/06/22 16:52:50
!-->
<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过" >
      <template #right>
        <EMore path="/" />
      </template>
      <div ref="hot" style="position: relative; height: 406px;">
        <transition name="fade" >
          <!-- 面板内容 默认插槽 如果list数据存在，显示ul下数据 -->
          <ul v-if="list && list.length" class="goods-list">
            <li v-for="item in list" :key="item.id">
              <router-link to="/" >
                <img :src="item.picture" alt="">
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </router-link>
            </li>
          </ul>
          <!-- 如果没有获取到list数据，显示骨架屏效果，让用户有更好的体验 -->
          <HomeSkeleton v-else />
        </transition>
      </div>

    </HomePanel>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'
export default defineComponent({
  name: 'HomeHot',

  components: {
    HomePanel,
    HomeSkeleton
  },

  props: {},

  setup () {
    // 获取的商品列表
    // const list = ref([])
    // findHot().then((res) => {
    //   console.log(res)
    //   list.value = res.result
    // })
    // 1.绑定一个监听对象，dom元素
    const hot = ref(null)
    // 监听hot是否进入可视区域
    // 2.传入api函数，函数内部调用，返回一个响应式数据
    const list = useLazyData(hot, findHot)
    // console.log(data.value)
    // list.value = data.value
    return {
      list,
      hot
    }
  }
})

</script>
<style lang='less' scoped>
// 元素移除时的 淡出动画效果 是骨架屏组件慢慢弹出
.fade{
  &-leave{ // fade-leave 离开时没有效果
    &-active{ // fade-leave-active
      position: absolute;
      width: 100%;
      transition: opacity 1s .2s;
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
.home-hot{
  .goods-list {
    display: flex;
    justify-content: space-between;
    height: 426px;
    li {
      width: 306px;
      height: 406px;
      .hoverShadow();
      img {
        width: 306px;
        height: 306px;
      }
      p {
        font-size: 22px;
        padding-top: 12px;
        text-align: center;
      }
      .desc {
        color: #999;
        font-size: 18px;
      }
    }
  }
}
</style>
