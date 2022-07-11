<!--
* @description 商品名称 价格 购买
* @fileName goods-name.vue
* @author echo9z
* @date 2022/07/07 18:13:39
!-->
<template>
  <p class="g-name">{{goods.name}}</p>
  <p class="g-desc">{{goods.desc}}</p>
  <p class="g-price">
    <span>{{goods.price}}</span>
    <span>{{goods.oldPrice}}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <!-- 配送地址组件 -->
      <dt>配送</dt>
      <dd>至 <ECity :fullLocation="fullLocation" @change="changeSelectCity"/></dd>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'GoodName',
  components: {},
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },

  setup (props) {
    // 与后台交互的时候需要产生哪些数据，省code，市code，地区code，它们组合再一起的文字。
    // 提供给后台的四项数据，用户没有登录默认情况下显示的是默认值 北京市 市辖区 东城区
    const provinceCode = ref('110000')
    const cityCode = ref('119900')
    const countyCode = ref('110101')
    const fullLocation = ref('北京市 市辖区 东城区')
    // 用户有登录，从商品数据中去重用户的收货地址，黑四个数据赋值
    if (props.goods.userAddresses) { // 如果存在则已登录了
      const defaultAddresses = props.goods.userAddresses.find(item => item.isDefault === 1) // 遍历查找地址中isDefault=1的属性，就是默认地址
      if (defaultAddresses) { // 如果有值，对四个数据进行赋值
        provinceCode.value = defaultAddresses.provinceCode
        cityCode.value = defaultAddresses.cityCode
        countyCode.value = defaultAddresses.countyCode
        fullLocation.value = defaultAddresses.fullLocation
      }
    }
    // 城市选择处理函数
    const changeSelectCity = (selectResult) => {
      provinceCode.value = selectResult.provinceCode
      cityCode.value = selectResult.cityCode
      countyCode.value = selectResult.countyCode
      fullLocation.value = selectResult.fullLocation
    }
    return {
      // 最后显示的后货地址，根据这个数据，传入e-city组件进行筛选
      fullLocation,
      changeSelectCity
    }
  }
})

</script>
<style lang='less' scoped>
.g-name {
  font-size: 22px
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }
    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }
    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}
.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
      &:last-child {
        span {
          margin-right: 10px;
          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }
        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
