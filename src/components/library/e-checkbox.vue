<!--
* @description 公共复选框组件
* @fileName e-checkbox.vue
* @author echo9z
* @date 2022/06/30 15:56:15
!-->
<template>
  <div class="e-checkbox" @click="changeChecked()" >
    <!-- 选中图标样式 -->
    <i class="iconfont icon-checked" v-if="checked"></i>
    <!-- 未选中图标 -->
    <i class="iconfont icon-unchecked" v-else ></i>
    <!-- span用于 给出一些文字提示信息
    判断是否有默认插槽内容，有就显示 -->
    <span v-if="$slots.default"><slot/></span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
export default defineComponent({
  name: 'ECheckBox',

  components: {},
  // v-model => :modelValue  @update:modelValue
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    // const checked = ref(false) // 控制选中 和 未选中的 显示 和 隐藏
    // // 点击 修改checked状态
    // const changeChecked = () => {
    //   checked.value = !checked.value
    //   // 将最新checked.value 通知父组件数据的改变
    //   emit('update:modelValue', checked.value)
    // }
    // // 使用侦听器，侦听父组件传入的值发生变化时，将变化的值赋值给checked
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, { immediate: true })

    // 上述代码 可以通过vueuse下的 useVModel封装函数，太替代上述的双向绑定代码
    // useVModel实现双向绑定
    // 第一个参数props对象，第二个参数父组件定义传递参数名称，第三个参数传入emit触发父组件事件
    // useVModel函数返回的是一个ref响应式数据
    const checked = useVModel(props, 'modelValue', emit) // <text v-model="true"> 默认 <text :modelValue="checkAll" @update:modelValue="checkAll = $event" />
    // 当点击时，将checked.value变化时会触发emit事件
    const changeChecked = () => {
      const newVal = !checked.value
      // 当前修改checked的值时，默认会监听到触发父组件事件
      checked.value = newVal // emit('update:modelValue', newVal)
      // 为父组件添加change事件处理逻辑
      emit('change', newVal)
    }
    return {
      checked,
      changeChecked
    }
  }
})

</script>
<style lang='less' scoped>
.e-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
