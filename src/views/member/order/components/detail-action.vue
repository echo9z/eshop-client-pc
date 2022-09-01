<!--
* @description 订单详情头部组件
* @fileName detail-action.vue
* @author echo9z
* @date 2022/08/31 11:57:32
!-->
<template>
  <div class="detail-action" v-if="order">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{orderStatus[order.orderState].label}}</p>
    </div>
    <div class="info">
      <p>订单编号：{{order.id}}</p>
      <p>下单时间：{{order.createTime}}</p>
    </div>
    <div class="btn">
      <!-- 待付款：立即付款，取消订单
        待发货：再次购买
        待收货：确认收货，再次购买
        待评价：评价商品，再次购买，申请售后
        已完成：查看评价，再次购买，申请售后
        已取消：-
        -->
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <EButton @click="$router.push('/member/pay?id='+order.id)" type="primary" size="small">立即付款</EButton>
        <EButton type="gray" @click="handlerCancel(order)" size="small">取消订单</EButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <EButton type="primary" @click="$router.push(`/member/checkout?orderId=${order.id}`)" size="small">再次购买</EButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <EButton type="primary" @click="handlerConfirm(order)" size="small">确认收货</EButton>
        <EButton type="plain" @click="$router.push(`/member/checkout?orderId=${order.id}`)"  size="small">再次购买</EButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <EButton type="primary" @click="$router.push(`/member/checkout?orderId=${order.id}`)"  size="small">再次购买</EButton>
        <EButton type="plain" size="small">评价商品</EButton>
        <EButton type="gray" size="small">申请售后</EButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <EButton type="primary" @click="$router.push(`/member/checkout?orderId=${order.id}`)"  size="small">再次购买</EButton>
        <EButton type="plain" size="small">查看评价</EButton>
        <EButton type="gray" size="small">申请售后</EButton>
      </template>
      <!-- 已取消 -->
    </div>
    <div>
      <!-- 取消订单组件 -->
      <OrderCancel ref="cancel" />
    </div>
  </div>
</template>

<script>
import { orderStatus } from '@/api/constants'
import { defineComponent } from 'vue'
import OrderCancel from './order-cancel.vue'
// 导出取消订单的复用逻辑
import { useCancel, useConfirm } from '../index.vue'
export default defineComponent({
  name: 'OrderDetailAction',

  components: { OrderCancel },

  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  setup () {
    return {
      orderStatus,
      ...useCancel(),
      ...useConfirm()
    }
  }
})

</script>
<style lang='less' scoped>
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .e-button {
      margin-left: 20px;
    }
  }
}
</style>
