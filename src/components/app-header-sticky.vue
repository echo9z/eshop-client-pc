<!--
* @description 导航栏吸顶，当页面向上卷曲高度大于78显示吸顶效果
* @fileName app-header-sticky.vue
* @author echo9z
* @date 2022/06/18 09:57:52
!-->
<template>
  <div class="app-header-sticky" :class="{show: showSticky}">
  <!-- 这里添加v-if="showSticky"，原因是当组件添加show样式显示吸顶组件，滚动距离 <78只是将show的样式去掉，
    通过透明度隐藏了，当前吸顶组件，所有没有 -->
    <div class="container" v-show="showSticky">
      <!-- 吸顶的logo -->
      <RouterLink class="logo" to="/" />
      <!-- 复用的吸顶组件AppHeaderNav -->
      <AppHeaderNav />
      <!-- 新增两个新项 -->
      <!-- <div class="right">
        <RouterLink to="/" >品牌</RouterLink>
        <RouterLink to="/" >专题</RouterLink>
      </div> -->
      <div class="right">
        <!-- 搜索 -->
        <div class="search">
          <i class="iconfont icon-search"></i>
        </div>
        <!-- 购物车 -->
        <AppHeaderCart />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import AppHeaderNav from './app-header-nav.vue'
// 基于组合api的 工具函数，包括鼠标移动 窗口移动 等等
import { useWindowScroll } from '@vueuse/core'
import AppHeaderCart from './app-header-cart.vue'
export default defineComponent({
  name: 'AppHeaderSticky',

  components: {
    AppHeaderNav,
    AppHeaderCart
  },

  props: {},

  setup () {
    // 记录y轴的卷曲高度 -- 传统的方式实现
    /* const y = ref(0)
    // 监听整个页面的窗口向上卷曲的高度，需要等于页面渲染完毕，进行监听，就需要在mounted执行
    onMounted(() => {
      // 监听窗口的滚动事件
      window.onscroll = () => {
        // 获取文档 即整个html
        y.value = document.documentElement.scrollTop
      }
    }) */
    // 通过vueuse中的useWindowScroll函数
    // useWindowScroll函数，返回 窗口卷曲高度的Reactive对象
    const { y } = useWindowScroll() // 结构y轴的卷曲高度
    const showSticky = computed(() => {
      return y.value >= 78 // 如果文档向上卷曲的高度大于78，添加show类样式
    })
    return {
      showSticky
    }
  }
})

</script>
<style lang='less' scoped>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 默认吸顶导航栏位置
  transform: translateY(-100%); // 默认位置向上移动到-80px位置
  opacity: 0; // 透明度为0，由0到1 渐变的显示吸顶
  &.show { // 用于添加show样式，显示吸顶导航
    transform: translateY(0);
    opacity: 1;
    transition: all 0.3s linear;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat  right 2px;
    background-size: 160px auto;
  }
  // .right {
  //   width: 220px;
  //   display: flex;
  //   text-align: center;
  //   padding-left: 40px;
  //   border-left: 2px solid @xtxColor;
  //   a {
  //     width: 38px;
  //     margin-right: 40px;
  //     font-size: 16px;
  //     line-height: 1;
  //     &:hover {
  //       color: @xtxColor;
  //     }
  //   }
  // }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    div {
      width: 38px;
      margin-right: 40px;
    }
    .search {
      width: 38px;
      height: 32px;
      position: relative;
      // border-bottom: 1px solid #e7e7e7;
      line-height: 32px;
      .icon-search {
        font-size: 18px;
        margin-left: 5px;
      }
    }
    .cart {
      width: 50px;
      .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;
        .icon-cart{
          font-size: 22px;
        }
        em {
          font-style: normal;
          position: absolute;
          right: 0;
          top: 0;
          padding: 1px 6px;
          line-height: 1;
          background: @helpColor;
          color: #fff;
          font-size: 12px;
          border-radius: 10px;
          font-family: Arial;
        }
      }
    }
  }
}
</style>
