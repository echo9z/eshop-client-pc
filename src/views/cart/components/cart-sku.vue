<!--
* @description 购物车sku组件
* @fileName cart-sku.vue
* @author echo9z
* @date 2022/08/10 10:59:56
!-->
<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 组件sku的弹出层 -->
    <div class="layer" v-if="visible">
      <!-- 加载效果 -->
      <div v-if="loading" class="loading"></div>
      <!-- 当选中的sku信息修改了，触发change事件 -->
      <GoodsSku v-else @change="changeSku" :skuId="skuId" :goods="goods" />
      <EButton v-if="!loading" size="mini" type="primary" @click="submit()">确认</EButton>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getGoodsSku } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
export default defineComponent({
  name: 'CartSku',

  components: { GoodsSku },

  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const loading = ref(false) // 控制加载load效果
    // 打开弹出层
    const open = async () => {
      visible.value = true
      loading.value = true
      // 当前弹出层打开时，获取商品的sku属性
      const res = await getGoodsSku(props.skuId)
      console.log(res)
      if (res.msg === '操作成功') {
        goods.value = res.result
        loading.value = false
      }
    }
    // 关闭弹出层
    const close = () => {
      visible.value = false
    }
    // 切换
    const toggle = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    // 参数1：监听那个元素
    // 参数2：点击监听外元素的外部，触发回调函数
    onClickOutside(target, (event) => close())

    // 修改购车车sku信息
    const sku = ref(null)
    const changeSku = (skuObj) => {
      if (skuObj) {
        sku.value = skuObj
      }
    }
    // 点击确认，将更改后的sku信息提交给父组件index.vue
    const submit = () => {
      // 当sku值有效，且sku与 skuId不相等
      if (sku.value && sku.value.skuId && sku.value.skuId !== props.skuId) {
        console.log(1)
        emit('change', sku)
      }
      close() // 关闭弹出层
    }
    return {
      visible,
      target,
      open,
      close,
      toggle,
      loading,
      goods,
      changeSku,
      submit
    }
  }
})

</script>
<style lang='less' scoped>
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
