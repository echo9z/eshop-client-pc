<!--
* @description 支付结果页面
* @fileName result.vue
* @author echo9z
* @date 2022/08/22 16:43:14
!-->
<template>
  <div class="e-pay-page">
    <div class="container">
      <EBread>
        <EBreadItem to="/">首页</EBreadItem>
        <EBreadItem to="/cart">购物车</EBreadItem>
        <EBreadItem>支付结果</EBreadItem>
      </EBread>
      <!-- 支付结果 -->
      <div class="pay-result" v-if="order">
        <span v-if="$route.query.payResult" class="iconfont icon-queren2 green"></span>
        <span v-else class="iconfont icon-shanchu red" ></span>
        <p class="tit">订单支付{{$route.query.payResult?'成功':'失败'}}</p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>支付方式：<span>支付宝支付</span></p>
        <p>支付金额：<span class="red">¥{{order.payMoney}}</span></p>
        <div class="btn">
          <EButton @click="$router.push('/member/order')" type="primary" style="margin-right:20px">查看订单列表</EButton>
          <EButton @click="$router.push('/')" type="gray">进入首页</EButton>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小兔鲜儿不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { findOrderDetail } from '@/api/order'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'PayResultPage',

  components: {},

  props: {},

  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.query.orderId).then(res => {
      if (res.msg === '操作成功') {
        // 根据id 查询的数据 赋值order
        order.value = res.result
      }
    })
    return {
      order
    }
  }
})

</script>
<style lang='less' scoped>
.pay-result {
  padding: 100px 0;
  background: #fff;
  text-align: center;
  > .iconfont {
    font-size: 100px;
  }
  .green {
    color: #1dc779;
  }
  .red {
    color: @priceColor;
  }
  .tit {
    font-size: 24px;
  }
  .tip {
    color: #999;
  }
  p {
    line-height: 40px;
    font-size: 16px;
  }
  .btn {
    margin-top: 50px;
  }
  .alert {
    font-size: 12px;
    color: #999;
    margin-top: 50px;
  }
}
</style>
