<!--
* @description 面板屑每个item项，每个item由 文字 > 这两部分组成
* @fileName e-bread-item.vue
* @author echo9z
* @date 2022/06/27 18:02:28
!-->
<template>
  <div class="e-bread-item">
    <!-- 判断当前是否传入to路径，如果有路径则使用RouterLink来渲染，没有就是span文本 -->
    <!-- 导航栏文字通过slot传入 -->
    <RouterLink v-if="to" :to="to"><slot/></RouterLink>
    <span v-else ><slot/></span>
  </div>
  <!-- <i class="iconfont icon-angle-right"></i> -->
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EBreadItem',

  components: {},

  props: {
    to: {
      // 为什么是String, Object原因是 闯入的方式有对象也有
      // <EBreadItem :to="{path:'/'}" >首页</EBreadItem>
      // <EBreadItem to="/category/1005002" >居家</EBreadItem>
      type: [String, Object],
      default: '' // 默认为''
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
