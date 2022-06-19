<!--
* @description 局部渲染的组件，一级分类显示的组件，比如点击美食显示美食相关内容
* @fileName index.vue
* @author echo9z
* @date 2022/06/17 16:50:31
!-->
<template>
  <div class="top-category">
    {{id}}
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TopCategory',

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
