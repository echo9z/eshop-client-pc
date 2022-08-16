<!--
* @description 消息提示组件
* @fileName e-message.vue
* @author echo9z
* @date 2022/07/26 17:27:57
!-->
<template>
  <Transition name="down">
    <div class="e-message" :style="tipStyle[type]" v-show="visible">
      <!-- 上面绑定的是样式 -->
      <!-- 不同提示图标会变 -->
      <i class="iconfont" :class="[tipStyle[type].icon]" ></i>
      <span class="text">{{text}}</span>
    </div>
  </Transition>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'EMessage',

  components: {},

  props: {
    text: {
      type: String,
      default: '提示信息'
    },
    type: {
      type: String,
      default: 'error'
    }
  },

  setup () {
    // 三个不同颜色的提示框信息，对象key就是类型字符串
    const tipStyle = {
      warn: {
        icon: 'icon-warning',
        color: '#E6A23C',
        backgroundColor: 'rgb(253, 246, 236)',
        borderColor: 'rgb(250, 236, 216)'
      },
      error: {
        icon: 'icon-shanchu',
        color: '#F56C6C',
        backgroundColor: 'rgb(254, 240, 240)',
        borderColor: 'rgb(253, 226, 226)'
      },
      success: {
        icon: 'icon-queren2',
        color: '#67C23A',
        backgroundColor: 'rgb(240, 249, 235)',
        borderColor: 'rgb(225, 243, 216)'
      }
    }

    // 控制元素显示和隐藏，默认是隐藏的，组件创建完毕后显示
    const visible = ref(false)
    onMounted(() => {
      // 组件加载完毕，显示组件
      visible.value = true
    })
    return {
      tipStyle,
      visible
    }
  }
})

</script>
<style lang='less' scoped>
.down {
  &-enter {
    &-from { // 进入时
      transform: translate3d(0,-75px,0);
      opacity: 0;
    }
    &-active { // 进入时
      transition: all 0.8s;
    }
    &-to { // 进入后
      transform: none;
      opacity: 1;
    }
  }
}
.e-message {
  width: 300px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -150px;
  top: 150px;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 4px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
}
</style>
