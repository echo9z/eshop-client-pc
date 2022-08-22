<!--
* @description 支付页面
* @fileName index.vue
* @author echo9z
* @date 2022/08/19 20:01:24
!-->
<template>
  <div class="e-pay-page">
    <div class="container">
      <EBread>
        <EBreadItem to="/">首页</EBreadItem>
        <EBreadItem to="/cart">购物车</EBreadItem>
        <EBreadItem>支付订单</EBreadItem>
      </EBread>
      <!-- 付款信息 -->
      <div class="pay-info" v-if="order">
        <span v-if="time > 0" class="icon iconfont icon-queren2"></span>
        <span v-else class="iconfont icon-shanchu red" ></span>
        <div class="tip">
          <template v-if="time > 0">
            <p>订单提交成功！请尽快完成支付。</p>
            <p>支付还剩 <span>{{timeText}}</span>, 超时后将取消订单</p>
          </template>
          <template v-else>
            <p>订单已超时</p>
            <p>请选择其他产品></p>
          </template>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{order.payMoney}}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <a class="btn alipay" @click="visible = true" :href="payUrl" target="_blank"></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
  <!-- 发起支付的对话框 -->
    <EDialog title="正在支付..." v-model:visible="visible">
      <div class="pay-wait">
        <img src="@/assets/images/load.gif" alt="">
        <div v-if="order">
            <p>如果支付成功：</p>
            <RouterLink :to="`/member/order/${order.id}`">查看订单详情></RouterLink>
            <p>如果支付失败：</p>
            <RouterLink to="/">查看相关疑问></RouterLink>
        </div>
      </div>
    </EDialog>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { findOrderDetail } from '@/api/order'
import { usePayTime } from '@/hooks/index'
import { baseURL } from '@/utils/request'
export default defineComponent({
  name: 'PayPage',

  components: {},

  props: {},

  setup () {
    const route = useRoute()
    const order = ref(null) // 订单对象
    // 跳转值订单详情页，通过route中的query查询参数 获取订单id
    findOrderDetail(route.query.id).then(data => {
      if (data.msg === '操作成功') {
        // 根据id 查询的数据 赋值order
        order.value = data.result
        // 后端提供一个countdown 订单倒计时多少秒后失效，订单的创建时间-服务器系统时间
        console.log(data.result.countdown)
        if (data.result.countdown > -1) {
          //   time.value = data.result.countdown
          //   // 在页面一加载的时候，显示倒计时 文字
          //   // 开启倒计时
          //   resume()
          start(data.result.countdown) // 开启倒计时
        }
      }
    })
    // 倒计时函数
    const { start, end, time, timeText } = usePayTime()

    /* // 使用 useIntervalFn处理短信倒计时逻辑
    const time = ref(0) // 一个默认的到计时的时间，一般都是通过后台获取的事件
    const timeText = ref('')
    const { pause, resume } = useIntervalFn(() => {
      // 倒计时处理的逻辑
      time.value--
      console.log(time.value)
      // 通过unix函数 安装格式转换为format
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) { // 小于等于0，停止定时器
        pause()
      }
    }, 1000, { immediate: false }) // immediate立即开启定时器) */

    onMounted(() => {
      // 组件销毁时，停止定时器
      end()
    })

    // 支付地址
    // 后台服务的基准地址 + 付支付接口地址 + 订单id + 回跳地址 页面
    const redirectUrl = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')
    const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirectUrl}`
    // 点击跳转支付宝，现在对话框，查看订单支付的状态
    const visible = ref(false) // 控制支付后的对话框显示
    return {
      order,
      timeText,
      time,
      payUrl,
      visible
    }
  }
})

</script>
<style scoped lang="less">
// 支付宝订单状态
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .red {
    font-size: 80px;
    color: @priceColor;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }
  }
}
</style>
