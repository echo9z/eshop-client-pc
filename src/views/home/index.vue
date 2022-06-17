<!--
* @description 首页
* @fileName index.vue
* @author echo9z
* @date 2022/06/16 11:29:17
!-->
<template>
  <div class="container">
    HomePage
  <div class="test"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomePage',

  components: {},

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
// @import '@/assets/styles/mixin.less';
.test{
  .hoverShadow();
  width: 100px;
  height: 100px;
}
</style>
