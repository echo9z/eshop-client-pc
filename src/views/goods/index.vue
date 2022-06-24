<!--
* @description 每个商品的组件，点击商品根据路由传参，接收商品id
* @fileName index.vue
* @author echo9z
* @date 2022/06/22 16:41:20
!-->
<template>
  <div class="product">
    {{id}}
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductPage',

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
