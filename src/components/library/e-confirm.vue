<!--
* @description 确认对话框组件
* @fileName e-confirm.vue
* @author echo9z
* @date 2022/08/08 14:40:18
!-->
<template>
  <div class="e-confirm" :class="{fade}" @click="cancel">
    <div class="wrapper" :class="{fade}" >
      <!-- 标题 -->
      <div class="header">
        <h3>{{title}}</h3>
        <a href="JavaScript:;" @click="cancel" class="iconfont icon-close-new"></a>
      </div>
      <!-- 提示内容 -->
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <!-- 按钮 -->
      <div class="footer">
        <EButton size="mini" @click="cancel" type="gray">取消</EButton>
        <EButton size="mini" @click="submit" type="primary">确认</EButton>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import EButton from '@/components/library/e-button.vue'
export default defineComponent({
  name: 'EConfirm',

  components: { EButton },

  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: '请确认内容'
    },
    cancelCallback: {
      type: Function
    },
    submitCallback: {
      type: Function
    }
  },

  setup (props) {
    // fade用于添加过渡动画效果，默认为false
    const fade = ref(false)
    // 组件渲染完毕显示按钮 测试用 fade为true显示动画
    onMounted(() => {
      // 过渡效果需要在元素创建时，延时一会再去添加fade类名
      setTimeout(() => { // 宏任务，在代码最后执行
        fade.value = true
      }, 0)
    })
    // 取消
    const cancel = () => {
      // fade.value = false
      props.cancelCallback()
    }
    // 确认
    const submit = () => {
      // fade.value = false
      // TODO:确认触发 Confirm中resolve
      props.submitCallback()
    }
    return {
      fade,
      cancel,
      submit
    }
  }
})

</script>
<style lang='less' scoped>
.e-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  // 遮罩层过渡动画
  background: rgba(0,0,0,0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0,0,0,.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    // 提示框滑下移动过渡动画
    transform: translate(-50%,-60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%,-50%);
      opacity: 1;
    }
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .e-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
