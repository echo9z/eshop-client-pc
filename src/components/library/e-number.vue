<!--
* @description 商品数量组件
* @fileName e-number.vue
* @author echo9z
* @date 2022/07/12 09:14:36
!-->
<template>
  <div class="e-numbox">
    <!-- label文字部分 用slot 来替代 -->
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" :class="{disabled: modelValue === min}" @click="changeNum(-1)">-</a>
      <input type="text" number :value="modelValue">
      <a href="javascript:;" :class="{disabled: modelValue === max}" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ENumBox',

  components: {},

  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    // 组件中最大值，和最大值，用使用组件时来确定的
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999
    }
  },

  setup (props, { emit }) {
    // 绑定按钮点击事件 -按钮  +按钮，触发同一个事件，同一个函数
    // 使用use 中 useVModel做数据绑定，返回的是一个响应式数据，修改count值，就会触发emit事件触发向父组件触发更新
    const count = useVModel(props, 'modelValue', emit)
    const changeNum = (step) => {
      // 得到将要改变的值，如果值不合法终止程序的运行
      const newValue = count.value + step
      if (newValue < props.min || newValue > props.max) return
      // 正常改值
      count.value = newValue
      // 组件提供change事件，触发父组件中的change，将最新值提供给父组件
      emit('change', newValue)
    }
    return {
      changeNum
    }
  }
})

</script>
<style lang='less' scoped>
.e-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
      &.disabled {
        opacity: 0.6;
        color: #ccc;
        cursor: not-allowed; // 禁止点击
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
