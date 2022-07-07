<!--
* @description 商品图片组件
* @fileName goods-image.vue
* @author echo9z
* @date 2022/07/06 19:35:30
!-->
<template>
  <div class="goods-image">
    <!-- 鼠标进入时的大图 -->
    <div class="large"
      :style="[{backgroundImage:`url(${images[currIndex]})`}, largePosition]"
      v-show="show"
    >
    </div>
    <!-- 左侧一个 图片 -->
    <div class="middle" ref="middle"
      @mousemove="moveMiddle"
      @mouseleave="leaveMiddle"
    >
      <!-- 默认图片显示的第一张图片 -->
      <img :src="images[currIndex]" alt="">
      <!-- 遮罩层的色块 -->
      <div class="layer"
        v-show="show"
        :style="layerPosition"
      ></div>
    </div>
    <!-- 右侧 5张小图-->
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <!-- 鼠标进入时，将索引 赋值给 currIndex -->
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default defineComponent({
  name: 'GoodsImage',

  components: {},

  props: {
    // 图片数据来自父组件
    images: {
      type: Array,
      default: () => []
    }
  },

  setup () {
    const currIndex = ref(0)
    const middle = ref(null)

    // 1.是否显示遮罩 和 显示大图
    const show = ref(false)
    // 2.遮罩层坐标（left 和 top）用于移动遮罩层
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 3.图片的背景定位 background-position进行移动大图
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4.使用useMouseInElement得到元素左上角的坐标和是否离开元素数据
    const { elementX, elementY, isOutside } = useMouseInElement(middle)
    watch([elementX, elementY, isOutside], () => {
      console.log(isOutside.value)
      show.value = !isOutside.value // 是否进入目标middle，进入isOutside值为false，没有进入isOutside值为true
      if (!isOutside.value) {
        let left = elementX.value - 100
        let top = elementY.value - 100
        // 移动范围在 100 至 200，横坐标移动小于100时，直接为0，原因是直接将遮罩
        left = elementX.value < 100 ? 0 : (elementX.value > 300 ? 200 : left)
        top = elementY.value < 100 ? 0 : (elementY.value > 300 ? 200 : top)
        // if (elementX.value < 100) {
        //   left = 0
        // } else if (elementX.value > 300) {
        //   left = 200
        // }
        // if (elementY.value < 100) {
        //   top = 0
        // } else if (elementY.value > 300) {
        //   top = 200
        // }
        layerPosition.left = left + 'px'
        layerPosition.top = top + 'px'
        largePosition.backgroundPositionX = -(left + 100) + 'px'
        largePosition.backgroundPositionY = -(top + 100) + 'px'
      }
      // console.log(elementX.value, elementY.value, isOutside.value)
    })
    const leaveMiddle = () => {
      show.value = false
    }
    return {
      currIndex,
      middle,
      // moveMiddle,
      leaveMiddle,
      show,
      layerPosition,
      largePosition
    }
  }
})

</script>
<style lang='less' scoped>
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  // 放大图片的盒子
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    // 精髓在背景图片的大小是 盒子大小的 二倍
    background-size: 800px 800px;
    background-color: #f8f8f8;
    // 通过background-position
  }
  // 展示的图片
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move; // 鼠标变为一个移动光标
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  // 竖着一排小图
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
