<!--
* @description 轮播图组件- 5张图片层叠在一起，通过设置每个li 的透明度 和 层级显示
* @fileName e-carousel.vue
* @author echo9z
* @date 2022/06/21 09:44:51
!-->
<template>
  <div class='e-carousel' @mouseenter="stop()" @mouseleave="start()">
    <!-- 轮播图的主体ul容器，放多个li，用于循环 -->
    <ul class="carousel-body">
      <!-- fade样式，用于控制每张图片的层级 和 透明度
      :class="{fade:index === i} 默认显示第一张 -->
      <li class="carousel-item" :class="{fade:index === i}"
        v-for="(item,i) in sliders" :key="item.id"
      >
        <!-- 商品大图 比如像首页中的轮播图，传入的 sliders的item属性有imgUrl属性-->
        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品列表 商品详情的推荐商品 -->
        <div v-else class="slider">
          <RouterLink v-for="goodsItem in item" :key="goodsItem.id"
            :to="`/product/${goodsItem.id}`"
          >
            <img :src="goodsItem.picture" alt="">
            <!-- 推荐商品名字 -->
            <p class="name ellipsis">{{goodsItem.name}}</p>
            <!-- 推荐商品价格 -->
            <p class="price">&yen;{{goodsItem.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <!-- 通过active 激活那个轮播图
      click="index = i" 让当前用个点击的点，进行切换 -->
      <span v-for="(item,i) in sliders" @click="index = i" :class="{ active:index === i }" :key="i"></span>
    </div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted, ref, watch } from 'vue'
export default defineComponent({
  name: 'ECarousel',

  components: {},

  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播，当然必须有数据才能做轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 间隔时间，每隔多少秒切换一次
    duration: {
      type: Number,
      default: 3000
    }
  },

  setup (props) {
    // 控制轮播图显示索引位置，默认是显示第一张
    const index = ref(0)

    // 1.自动轮播的逻辑，下面加上注册不同使用eslint对timer进行校验
    let timer = null // 定时器id
    const autoPlayFn = () => {
      clearInterval(timer) // 防止定时重复开启 只要开启循环定时器，一开始是就有清楚定时器
      // 生成定时器，自动播放，每隔多久切换一次索引
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 什么时候调用 autoPlayFn函数进行播放呢，第一请求的 sliders数据没有返回，则不进行播放，第二是否传入组件进行自动播放功能
    // 需要监听sliders数据变化，判断是否传入autoPlay，且为true
    watch(() => props.sliders, (newVal) => {
      // sliders的数组长度不为空，同时autoPlay为true
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true }) // 这里一开始就执行一次是为防止，传入的sliders数据是一个静态数据，不让动态请求的数组，写死的数组

    // 2.鼠标进入 停止播放，离开自动播放，播放添加和上慢慢一样
    const stop = () => {
      clearInterval(timer)
    }
    const start = () => {
      // sliders要有数据，同时设置为自动播放
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 3.上一张图片 下一张
    const toggle = (step) => {
      let newIndex = index.value + step
      console.log(newIndex)
      if (newIndex > props.sliders.length - 1) { // 点击下一张，索引为4 变为第一张
        newIndex = 0
      } else if (newIndex < 0) {
        newIndex = 4
      }
      index.value = newIndex
    }

    // 4.组件卸载时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      index,
      stop,
      start,
      toggle
    }
  }
})

</script>
<style lang='less' scoped>
.e-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      // 轮播图是5张图片叠一起，通过设置透明度 和 层级进行显示
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
      // 轮播商品list 样式
      .slider {
        display: flex;
        justify-content: space-around;
        padding: 0 40px;
        > a {
          width: 240px;
          text-align: center;
          img {
            padding: 20px;
            width: 230px!important;
            height: 230px!important;
          }
          .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
          }
          .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
          }
        }
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
