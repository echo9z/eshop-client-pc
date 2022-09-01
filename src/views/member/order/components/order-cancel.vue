<!--
* @description 取消订单组件
* @fileName order-cancel.vue
* @author echo9z
* @date 2022/08/29 16:01:36
!-->
<template>
  <EDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          href="javascript:;"
          :class="{ active: curText === item }"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 按钮 -->
    <template #footer>
      <EButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</EButton>
      <EButton @click="submit" type="primary">确认</EButton>
    </template>
  </EDialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { cancelReason } from '@/api/constants'
import Message from '@/components/library/Message'
import { cancelOrder } from '@/api/order'
export default defineComponent({
  name: 'OrderCancel',

  components: {},

  props: {
  },

  setup () {
    const visibleDialog = ref(false)
    const curText = ref('') // 取消的选中订单理由
    const curOrder = ref(null)
    // 通过调用当前组件实例，调用open方法显示组件
    const open = (order) => {
      visibleDialog.value = true
      // 当点击order-item组件取消订单是，通过open方法将
      curOrder.value = order
    }
    // 确认取消订单函数
    const submit = () => {
      // 取消原因不为空
      if (!curText.value) return Message({ text: '亲，请选择取消原因' })
      cancelOrder({ orderId: curOrder.value.id, cancelReason: curText.value }).then(data => {
        Message({ type: 'success', text: '取消订单成功' })
        // 修改当前订单状态，为取消状态
        curOrder.value.orderState = 6
        visibleDialog.value = false // 关闭对话框
      })
    }

    return {
      cancelReason,
      visibleDialog,
      curText,
      open,
      submit
    }
  }
})

</script>
<style lang='less' scoped>
.e-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
