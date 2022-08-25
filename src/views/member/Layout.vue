<!--
* @description 个人中心布局容器
* @fileName Layout.vue
* @author echo9z
* @date 2022/08/22 19:49:39
!-->
<template>
  <div class="container">
    <MemberAside />
    <article class="article">
      <!-- 三级路由视图展示 -->
      <RouterView></RouterView>
    </article>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MemberAside from '@/components/app-member-aside.vue'
export default defineComponent({
  name: 'MemberLayout',

  components: { MemberAside },

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
