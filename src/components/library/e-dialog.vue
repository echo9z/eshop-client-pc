<!--
* @description 对话框组件
* @fileName e-dialog.vue
* @author echo9z
* @date 2022/08/16 18:40:08
!-->
<template>
  <!-- v-show="visible" 根据visible传入true控制，dialog组件的显示和隐藏
  先执行v-show dialog，再执行fade过渡动画 -->
  <div class="e-dialog" v-show="visible" :class="{fade}">
    <div class="wrapper" :class="{fade}">
    <!-- 标题 -->
      <div class="header">
        <h3>{{title}}</h3>
        <!-- 叉叉关闭按钮 -->
        <a href="JavaScript:;" @click="closeDialog" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <!-- 默认插槽 用于插入内容组件 -->
        <slot />
      </div>
      <div class="footer">
        <!-- 具名插槽 按钮 -->
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
// vue3 <Dialog v-model:visible /> 语法糖，拆解为 <Dialog :visible='vis' @update:visible="vis=$event" />
// vue3.0 v-model:visible 语法糖，拆解 （:visible + @update:visible）
// vue2.0 visible.sync 语法糖，拆解 （:visible + @update:visible）
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'EDialog',

  components: {},

  props: {
    title: {
      type: String,
      default: '标题'
    },
    // 控制 fade 动画，显示dialog对话框
    visible: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    const fade = ref(false)
    // 测试组件
    // onMounted(() => {
    //   setTimeout(() => { // 添加过渡效果，需要延迟
    //     fade.value = true
    //   }, 50)
    // })
    // visible的值为true打开对话框，否则就是关闭对话框
    watch(() => props.visible, (newValue) => {
      // 监听visible变化，赋值给fade属性
      setTimeout(() => { // 添加过渡效果，需要延迟
        fade.value = newValue
      }, 0)
    }, { immediate: true })

    // 点击xx关闭对话框，修改父组件的visible的值为false
    const closeDialog = () => {
      emit('update:visible', false)
    }
    return {
      fade,
      closeDialog
    }
  }
})

</script>
<style lang='less' scoped>
.e-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8887;
  background: #00000000;
  &.fade { // 添加上e-dialog fade 透明为黑色背景
    transition: all 0.4s;
    background: rgba(0,0,0,.5);
  }
  .wrapper {
    width: 600px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-60%);
    opacity: 0; // 原来是透明的
    &.fade { // 添加wrapper fade 变为不透明
      transition: all 0.4s;
      transform: translate(-50%,-50%);
      opacity: 1;
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
      text-align: center;
      padding: 10px 0 30px 0;
    }
    .header {
      position: relative;
      height: 70px;
      line-height: 70px;
      padding: 0 20px;
      border-bottom: 1px solid #f5f5f5;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 25px;
        top: 25px;
        font-size: 24px;
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
