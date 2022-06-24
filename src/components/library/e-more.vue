<!--
* @description 像人气推荐 新鲜好物的右上角 查看全部 公共组件
* @fileName e-more.vue
* @author echo9z
* @date 2022/06/22 14:22:42
!-->
<template>
  <router-link :to="path" class="e-more">
    <span>查看全部</span>
    <i class="iconfont icon-angle-right"></i>
  </router-link>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EMore',

  components: {},

  props: {
    path: { // 根据通过品类，传入不同路径，就行home页的展示
      type: String,
      default: '/'
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.e-more {
  margin-bottom: 2px;
  span {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
    color: #999;
  }
  i {
    font-size: 14px;
    vertical-align: middle;
    position: relative;
    top: 2px;
    color: #ccc;
  }
  &:hover {
    span,i {
      color: @xtxColor;
    }
  }
}
</style>
