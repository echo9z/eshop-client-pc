<!--
* @description 个人中心
* @fileName index.vue
* @author echo9z
* @date 2022/08/22 17:42:21
!-->
<template>
  <div class="member-home" v-if="goods.length">
    <!-- 概览 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏" >
      <GoodsItem v-for="item in goods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹" >
      <GoodsItem v-for="item in goods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import GoodsItem from '@/views/category/components/category-goods-item.vue'
import { findCollect } from '@/api/member'
// import request from '@/utils/request'
export default defineComponent({
  name: 'MemberHome',

  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },

  props: {},

  setup () {
    // const goods = ref({
    //   id: '1',
    //   name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
    //   picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
    //   desc: '清汤鲜香 红汤劲爽',
    //   price: '159.00'
    // })

    // 调用mock生成接口数据 /my/test
    // request('/my/test', 'get').then(res => {
    //   console.log(res)
    // })
    const goods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(data => {
      console.log(data)
      goods.value = data.result.items
    })

    return {
      goods
    }
  }
})

</script>
<style lang='less' scoped>
:deep(.e-carousel .carousel-btn.prev) {
  left: 0;
  color: #9a9a9a;
}
:deep(.e-carousel .carousel-btn.next) {
  right: 0;
  color: #9a9a9a;
}
:deep(.home-panel) .goods-list {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
}
</style>
