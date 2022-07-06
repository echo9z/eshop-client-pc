<!--
* @description 加载更多组件，当组件出现在可视区域，直接加载数据
* @fileName e-infinite.vue
* @author echo9z
* @date 2022/07/04 16:41:59
!-->
<template>
  <div class="e-infinite-loading" ref="infinite">
    <!-- 处理loading为true，显示正在加载dom -->
    <div class="loading" v-if="modelValue" >
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <!-- finished为false，服务器返回数据为空，表示没有更多数据，显示下面dom -->
    <div class="none" v-if="finished" >
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export default defineComponent({
  name: 'EInfiniteLoading',
  props: {
    modelValue: { // 加载数据状态，当数据加载时，值为true，执行数据加载
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 当组件出现在窗口的可视区域，将父组件中的
    const infinite = ref(null)
    const { stop } = useIntersectionObserver(infinite, async ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 无限加载组件加载状态为false，将父组件中的双向绑定的loading值改为true，表示处于数据加载中
        if (!props.modelValue && !props.finished) {
          console.log('进入可视区')
          emit('update:modelValue', true)
          // 触发父组件的infinite函数，组件函数是用于数据请求的
          emit('infinite')
        }

        if (props.finished) {
          stop() // 如果返回的数据为空，则停止对无限加载组件的观察
        }
      }
    }, { threshold: 0 })

    return {
      infinite
    }
  }
})

</script>
<style lang='less' scoped>
.e-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
