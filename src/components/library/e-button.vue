<!--
* @description 通用按钮组件
* @fileName e-button.vue
* @author echo9z
* @date 2022/07/12 11:28:00
!-->
<template>
  <button class="e-button ellipsis" :class="[size,type]">
    <slot />
  </button>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EButton',

  components: {},

  props: {
    // 设置按钮的大小
    size: {
      type: String,
      default: 'middle'
    },
    // 设置按钮的类型颜色
    type: {
      type: String,
      default: 'default'
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.e-button {
  appearance: none;
  border: none;
  outline: none;
  background: #fff;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}
.large {
  width: 240px;
  height: 50px;
  font-size: 16px;
}
.middle {
  width: 180px;
  height: 50px;
  font-size: 16px;
}
.small {
  width: 100px;
  height: 32px;
  font-size: 14px;
}
.mini {
  width: 60px;
  height: 32px;
  font-size: 14px;
}
.default {
  border-color: #e4e4e4;
  color: #666;
}
.primary {
  border-color: @xtxColor;
  background: @xtxColor;
  color: #fff;
}
.plain {
  border-color: @xtxColor;
  color: @xtxColor;
  background: lighten(@xtxColor,50%);
}
.gray {
  border-color: #ccc;
  background: #ccc;;
  color: #fff;
}
</style>
