<!--
* @description 订单详情组件
* @fileName detail.vue
* @author echo9z
* @date 2022/08/24 18:15:02
!-->
<template>
  <div class="member-order-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order" />
    <!-- 进度 -->
    <DetailStep :order="order" />
    <!-- 物流 物流信息状态为3 4 5显示组件-->
    <Suspense>
      <!-- DetailLogistics异步组件加载完毕后显示 default-->
      <template #default>
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order" />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 信息 -->
    <DetailInfo :order="order" />
  </div>
</template>

<script>
import { findOrderDetail } from '@/api/order'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import DetailAction from '../order/components/detail-action.vue'
import DetailStep from '../order/components/detail-step.vue'
import DetailLogistics from '../order/components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'
export default defineComponent({
  name: 'MemberDetail',

  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },

  props: {},

  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return {
      order
    }
  }
})

</script>
<style lang='less' scoped>
.member-order-detail{
  background-color: #fff;
  height: 100%;
}
.loading{
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
