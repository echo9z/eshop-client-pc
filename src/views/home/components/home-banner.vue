<!--
* @description 存放轮播图组件
* @fileName home-banner.vue
* @author echo9z
* @date 2022/06/21 10:18:30
!-->
<template>
  <div class="home-banner">
    <!-- 轮播图组件  将sliders数据传递给轮播图组件 -->
    <ECarousel :sliders="sliders" autoPlay />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { findBanner } from '@/api/home'
export default defineComponent({
  name: 'HomeBanner',

  components: {},

  props: {},

  setup () {
    const sliders = ref([])
    findBanner().then(data => {
      // 将数据赋值给sliders
      console.log(data.result)
      sliders.value = data.result
    })
    return {
      sliders
    }
  }
})

</script>
<style lang='less' scoped>
.home-banner{
  width: 1240px;
  height: 500px;
  position: absolute; // 绝对定位
  left: 0;
  top: 0;
  z-index: 98;
}
// 覆盖组件的样式，调整为自己想要的样式
.e-carousel {
  // /deep/ 或者 ::v-deep 深度作用 在vue3中使用:deep()
  :deep(.carousel-btn.prev) { // 覆盖左侧距离
    left: 270px;
  }
  :deep(.carousel-indicator) { // 中间五个肖安娜位置
    padding-left: 250px;
  }
}
</style>
