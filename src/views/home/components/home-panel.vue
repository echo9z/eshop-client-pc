<!--
* @description 公用面板，标题 右侧具名插槽，主体区域显示默认插槽
* @fileName home-panel.vue
* @author echo9z
* @date 2022/06/22 14:55:22
!-->
<template>
  <div class="home-panel">
    <div class="container">
      <!-- 面板分为上下两部分 标题 和 下方商品推荐 -->
      <div class="head">
        <h3>
          {{title}} <small>{{subTitle}}</small>
        </h3>
        <!-- 具名插槽 右上角  更多 或者 商品的左右推荐 -->
        <slot name="right"></slot>
      </div>
      <!-- 默认插槽 存放商品片板内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomePanel',

  components: {},

  props: {
    title: { // 标题
      type: String,
      default: ''
    },
    subTitle: { // 副标题
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
  position: relative;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
