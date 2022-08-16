<!--
* @description 收货地址组件
* @fileName checkout-address.vue
* @author echo9z
* @date 2022/08/15 18:20:00
!-->
<template>
  <div class="checkout-address">
    <div class="text">
      <!-- showAddress没有数据显示 添加收货 -->
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-else >
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <!-- /^(\d{3})\d{4}(\d{4})/, '$1****$2' 意思$1替换第一段3位 中间*号替换4位  -->
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation}} {{showAddress.address}}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <EButton class="btn">切换地址</EButton>
      <EButton class="btn">添加地址</EButton>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'CheckoutAddress',

  components: {},

  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },

  setup (props) {
    // 1.找到收货地址
    // 2.没有默认收货地址，使用第一条收货地址
    // 3.没有受过地址，显示提示请求添加后货地址
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0) // 获取数据isDefault为0，默认的收货地址
    if (defaultAddress) { // 如果默认收货地址存在
      showAddress.value = defaultAddress
    } else { // 没有默认的收货地址，则取出第一条数据
      // props.value.list 收货地址数组长度有数据，则默认取出第一条数据
      showAddress.value = props.list.length && props.list[0]
    }
    return {
      showAddress
    }
  }
})

</script>
<style lang='less' scoped>
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>