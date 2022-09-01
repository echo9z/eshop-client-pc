<!--
* @description 订单详情物流展示组件
* @fileName detail-logistics.vue
* @author echo9z
* @date 2022/09/01 10:47:32
!-->
<template>
  <div class="detail-logistics">
    <p>
      <span>{{logisticsList[0].text}}</span>
      <span>{{logisticsList[0].time}}</span>
    </p>
    <a href="javascript:;">查看物流</a>
  </div>
</template>

<script>
import { logisticsOrder } from '@/api/order'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'DetailLogistics',

  components: {},

  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  // 组件实例化的时候需要执行setup，
  async setup (props) { // setup是在组件初始化的时执行，但是加了async异步函数，需要等待才能执行
    // 根据order订单 获取订单物流信息
    const data = await logisticsOrder(props.order.id)
    // 订单的物流信息
    const logisticsList = ref(data.result.list)
    return {
      logisticsList
    }
  }
})

</script>
<style lang='less' scoped>
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
