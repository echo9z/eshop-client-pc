<!--
* @description 局部渲染的组件，二级分类显示的组件，比如点击美食下的 米面粮油 显示相关二级内容
* @fileName subcategory.vue
* @author echo9z
* @date 2022/06/17 16:55:19
!-->
<template>
  <div class="sub-category">
    {{id}}
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SubCategory',

  components: {},

  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
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
