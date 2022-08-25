<!--
* @description 面板组件
* @fileName home-panel.vue
* @author echo9z
* @date 2022/08/23 10:22:55
!-->
<template>
  <div class="home-panel">
    <!-- 标题 -->
    <div class="header">
      <h4>{{ title }}</h4>
      <EMore to="/" />
    </div>
    <!-- 商品列表 -->
    <div class="goods-list">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MemberHomePanel',

  components: {},

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.home-panel {
  background-color: #fff;
  padding: 0 20px;
  margin-top: 20px;
  height: 400px;
  .header {
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 18px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    h4 {
      font-size: 22px;
      font-weight: normal;
    }
  }
}
</style>
