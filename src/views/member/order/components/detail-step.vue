<!--
* @description 订单进度组件
* @fileName detail-step.vue
* @author echo9z
* @date 2022/08/31 15:43:02
!-->
<template>
  <div class="detail-step">
    <ESteps :active="order.orderState === 6 ? 1: order.orderState">
      <EStepsItem title="提交订单" :desc="order.createTime"></EStepsItem>
      <EStepsItem title="付款成功" :desc="order.payTime"></EStepsItem>
      <EStepsItem title="商品发货" :desc="order.consignTime"></EStepsItem>
      <EStepsItem title="确认收货" :desc="order.endTime"></EStepsItem>
      <EStepsItem title="订单完成" :desc="order.evaluationTime"></EStepsItem>
    </ESteps>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DetailStep',

  components: {},

  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.detail-step{
  padding: 20px;
}
</style>
