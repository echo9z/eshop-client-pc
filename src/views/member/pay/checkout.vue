<!--
* @description 订单结算界面
* @fileName checkout.vue
* @author echo9z
* @date 2022/08/15 17:40:59
!-->
<template>
  <div class="e-pay-checkout-page">
    <div class="container">
      <EBread>
        <EBreadItem to="/">首页</EBreadItem>
        <EBreadItem to="/cart">购物车</EBreadItem>
        <EBreadItem >填写订单</EBreadItem>
      </EBread>
      <!-- 要等order有数据在进行页面渲染 -->
      <div class="wrapper" v-if="order">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <!-- userAddresses地址收货列表 -->
          <CheckoutAddress :list="order.userAddresses" @change="changeAddress($event)" />
        </div>

        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.goods" :key="item.skuId">
                <td>
                  <RouterLink :to="`/product/${item.id}`" class="info">
                    <img :src="item.picture" alt="">
                    <div class="right">
                      <p>{{item.name}}</p>
                      <p>{{item.attrsText}}</p>
                    </div>
                  </RouterLink>
                </td>
                <td>&yen;{{item.price}}</td>
                <td>{{item.count}}</td>
                <td>&yen;{{item.totalPrice}}</td>
                <td>&yen;{{item.totalPayPrice}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>

        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>

        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl><dt>商品件数：</dt><dd>{{order.summary.goodsCount}}件</dd></dl>
            <dl><dt>商品总价：</dt><dd>¥{{order.summary.totalPrice}}</dd></dl>
            <dl><dt>运<i></i>费：</dt><dd>¥{{order.summary.postFee}}</dd></dl>
            <dl><dt>应付总额：</dt><dd class="price">¥{{order.summary.totalPayPrice}}</dd></dl>
          </div>
        </div>

        <!-- 提交订单 -->
        <div class="submit">
          <EButton type="primary" @click="submitOrderFn">提交订单</EButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import CheckoutAddress from './components/checkout-address.vue'
import { createdOrder, submitOrder } from '@/api/order'
import Message from '@/components/library/Message'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'CheckoutPage',

  components: { CheckoutAddress },

  props: {},

  setup () {
    // 订单信息
    const order = ref(null)
    const router = useRouter()
    createdOrder().then(data => {
      order.value = data.result
      reqParams.goods = data.result.goods.map(item => ({ skuId: item.skuId, count: item.count }))
    }).catch(e => {
      console.log(e)
      const data = e.response.data
      if (data.code === '18008' && data.message === '无有效商品') {
        Message({ type: 'error', text: data.message })
        return router.push('/cart')
      }
    })

    // 结算功能 - 提交订单对象
    const reqParams = reactive({
      goods: [],
      addressId: null, // 所选地址Id 初始checkoutAddress组件时，赋值addressId
      deliveryTimeType: '', // 配送时间类型，1为不限，2为工作日，3为双休或假日
      payType: 1, // 支付方式，1为在线支付，2为货到付款
      payChannel: 1, // 支付渠道：支付渠道，1支付宝、2微信--支付方式为在线支付时，传值，为货到付款时，不传值
      buyerMessage: 'test' // 买家留言
    })

    // 提交订单对象
    // const addressId = ref(null)
    const changeAddress = (id) => {
      console.log(id)
      reqParams.addressId = id
      console.log(reqParams.addressId)
    }

    // 提交订单逻辑
    const submitOrderFn = () => {
      // 是否存在收货地址
      if (!reqParams.addressId) return Message({ type: 'warn', text: '亲，请选择收货地址' })
      submitOrder(reqParams).then(data => {
        Message({ type: 'success', text: '提交订单成功' })
        console.log(data)
        // 跳转至支付页面
        router.push({ path: '/member/pay', query: { id: data.result.id } })
      })
    }
    return {
      order,
      changeAddress,
      submitOrderFn
    }
  }
})

</script>
<style scoped lang="less">
.e-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,&:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
