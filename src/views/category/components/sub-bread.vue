<!--
* @description 二级面包屑
* @fileName sub-bread.vue
* @author echo9z
* @date 2022/06/29 16:20:59
!-->
<template>
  <EBread>
    <EBreadItem to="/">首页</EBreadItem>
    <EBreadItem v-if="category.top" :to="`/category/${category.top.id}`" >{{category.top.name}}</EBreadItem>
    <Transition name="fade-right">
      <EBreadItem :key="category.sub.id" v-if="category.sub" >{{category.sub.name}}</EBreadItem>
    </Transition>
  </EBread>
</template>

<script>
import { computed, defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'SubBread',

  components: {},

  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },

  setup (props) {
    // 通过计算属性从vuex获取顶级 和二级类目信息
    // 数据对象：{top:{id,name}, sub:{id,name}}
    const store = useStore()
    const category = computed(() => {
      const cate = reactive({})
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => props.id === sub.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return {
      category
    }
  }
})

</script>
<style lang='less' scoped>
</style>
