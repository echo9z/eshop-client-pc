<!--
* @description 面包屑组件
* @fileName e-bread.vue
* @author echo9z
* @date 2022/06/27 11:07:22
!-->
<!-- <template>
  <div class='e-bread'>
    默认插槽，用于放置每一项e-bread-item
    <slot></slot>
  </div>
</template> -->
<!-- 初级的面包屑，传入属性值，显示固定的标题，只能显示一级 和 二级标题
<template>
  首页，所有导航第一项都是首页
  <div class="e-bread-item">
    <RouterLink to="/">首页</RouterLink>
  </div>
  <i class="iconfont icon-angle-right"></i>
  一级类目 比如居家
  <div class="e-bread-item" v-if="parentName">
    <RouterLink v-if="parentPath" :to="parentPath">{{parentName}}</RouterLink>
    如果只传递了name，没有传递path，就不渲染待跳转路径的标签
    <span v-else >{{parentName}}</span>
  </div>
  <i v-if="parentName" class="iconfont icon-angle-right"></i>
  这里v-if="parentName"上面两个逻辑是，
    如果请求二级类目，即parentName和parentPath有传递，需要有箭头和 二级标题，下面的二级类目就是二级类目
    如果请求一级类目，即parentName和parentPath没有传递，说明没有 箭头和 二级标题，下面的二级类目充当一级类目使用，用slot进行占位
  二级类目 比如居家下的水具水壶
  <div class="e-bread-item">
    <span><slot /></span>
  </div>
</template>
-->

<script>
import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'EBread',

  components: {},

  render () {
    // vue2.0的 h函数，实在reader的参数中传入 render (h) {return h(....)}
    // vue3.0的 h函数，通过vue 进行按需导读import { h } from 'vue'
    // h函数参数 第一个参数 标签名称，第二个参数 标签属性对象 三个参数 子节点，当前父级标签下子级dom元素
    // 需求：
    // 1.创建一个div容器
    // 2.获取默认的插槽 this.$slots.default()
    // 3.去除e-bread-item 组件中的 i元素标签，通过reader创建右边结构 => <i class="iconfont icon-angle-right"></i>
    // 4.遍历插槽中的 每个slot元素，得到每个动态创建节点，将最后一个slot不添加 通过动态h函数创建 i标签节点
    // 5.再把新数组渲染到 div下
    const slots = this.$slots.default()
    const arr = []
    // console.log(slots)
    if (!slots.length) return
    slots.forEach((slot, index) => {
      if (index === slots.length - 1) { // 等于最后一个slot元素不需要添加 i
        arr.push(slot)
      } else {
        arr.push(slot, h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    console.log(arr)
    return h('div', { class: 'e-bread' }, arr) // 等价于 <div class='e-bread'><slot /></div>
  },
  /* props: {
    // 传递parentPath 和 parentName说明是请求二级类目的数据，所有就会有一级类目数据
    // 父级类目路径 渲染一级类目的路径
    parentPath: {
      type: [String, Object],
      default: '/' // 默认为/
    },
    // 父级类目名称 渲染一级类目的名称
    parentName: {
      type: String,
      default: ''
    }
  }, */

  setup () {
    return {
    }
  }
})

</script>
<!-- 取消scoped，全局生效，让效果作用与e-bread-item-->
<style lang='less'>
.e-bread {
  display: flex;
  padding: 25px 10px;

  &-item {
    a { // 如果是a链接 字体颜色浅一些
      color: #666;
      transition: all .4s;

      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 找到e-bread 下所有子元素 i，移除样式，样式移除i不合理，结构变了
    /* i:last-child {
      display: none
    } */
    // ul li:last-child{} 先找到父元素，找到所有的子元素，找最后一个元素，判断是不是li，是就选中，不是就不选中
    // ul li:last-of-type{} 先找到父元素，找到所有类型为li的元素，选中最后一个
  }
}
</style>
