<!--
* @description 品牌推荐
* @fileName home-brand.vue
* @author echo9z
* @date 2022/06/23 19:37:00
!-->
<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <!-- 右上角上一张 和 下一张按钮 -->
    <template v-slot:right>
      <!-- index等于第一页，给a按钮添加禁用点击样式 -->
      <a @click="toggle(-1)" :class="{disabled: index === 0}" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(1)" :class="{disabled: index === page}" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <div ref="target" style="position: relative; ">
      <transition name="fade">
        <!-- 默认插槽位置 -->
        <div v-if="brands.length" class="box">
          <!-- 整个ul移动的位置根据index移动步长进行移动 -->
          <ul class="list" :style="`transform: translateX(${index * -1240}px);`" >
            <!-- 放置10个品牌 -->
            <li v-for="item in brands" :key="item.id">
              <router-link to="/">
                <img :src="item.picture" alt="">
              </router-link>
            </li>
          </ul>
        </div>
        <!-- brands数据没有显示，骨架屏效果 -->
        <div v-else class="skeleton">
          <ESkeleton class="item" v-for="i in 5" :key="i" width="240px" height="305px" bg="e4e4e4" animated />
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HomePanel from './home-panel.vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default defineComponent({
  name: 'HomeBrand',

  components: {
    HomePanel
  },

  props: {},

  setup () {
    // const brands = ref([])
    // // 获取数据
    // findBrand(10).then(data => {
    //   brands.value = data.result
    // })

    // 右上角 左右按钮切换
    const index = ref(0)
    const page = ref(10 / 5 - 1)// 根据请求的数据，一行显示5个数据 10 / 5 - 1 = 1 等于1说明只有两页
    // 上一页  下一页
    const toggle = (step) => {
      const newInx = index.value + step // 每次用户点击位置
      if (newInx < 0 || newInx > page.value) {
        return // 移动的页面值，不在其页面范围内。超出范围直接返回
      }
      index.value = newInx
    }
    const target = ref(null) // 监视的dom元素
    // 组件数据懒加载
    // 注意：useLazyData的API函数需要传入参数，可以写一个箭头函数
    const brands = useLazyData(target, () => findBrand(10))
    return {
      brands,
      index,
      toggle,
      page,
      target
    }
  }
})

</script>
<style lang='less' scoped>
// 过渡效果
.fade{
  &-leave{ // fade-leave 离开时没有效果
    &-active{ // fade-leave-active 这里加绝对定位
      position: absolute; // 这里为了骨架屏在覆盖在每个商品推荐li上，原因是显示骨架屏组件显示，慢慢淡出，此时lu面板数据的dom元素创建，就会出现两个元素，上面是骨架屏，下面是商品li
      width: 100%;
      transition: opacity 1s .2s;
      z-index: 1;
    }
    &-to { // fade-leave-to 离开后
      opacity: 0;
    }
  }
}
// 骨架屏幕效果
.skeleton{
  width: 100%; // 撑满版心1240
  display: flex;
  .item{
    margin-right: 10px;
    &:nth-child(5n){ // 最后一个即第五个 5*1
      margin-right: 0;
    }
  }
}
.home-panel { // 覆盖组件面板的样式
  background:#f5f5f5
}
.iconfont { // 右侧 左右按钮样式
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled { // 左右按钮禁用效果
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;  // 一行 装下5个品牌图片
  height: 345px;
  overflow: hidden; // 溢出的5个品牌进行隐藏
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
