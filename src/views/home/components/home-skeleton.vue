<!--
* @description home的骨架组件，将公用的e-skeleton组件，在数据还没有渲染出来时，用骨架组屏组件来渲染
* @fileName home-skeleton.vue
* @author echo9z
* @date 2022/06/23 09:34:58
!-->
<template>
  <div class='home-skeleton'>
    <div class="item" v-for="i in 4" :key="i" :style="{backgroundColor:bg}">
      <!-- 覆盖面板中好物推荐图片区域 -->
      <ESkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <!-- 覆盖推数据商品标题区域 -->
      <ESkeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <!-- 价格或者描述 -->
      <ESkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomeSkeleton',

  components: {},

  props: {
    bg: { // 每个div盒子的背景样式
      type: String,
      default: '#fff'
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.home-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .e-skeleton ~ .e-skeleton{
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
