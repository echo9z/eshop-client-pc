<!--
* @description 订单详情
* @fileName index.vue
* @author echo9z
* @date 2022/08/24 17:24:38
!-->
<template>
  <div class="member-order">
    <!-- <RouterLink to="/member/order/1001" >1</RouterLink><br>
    <RouterLink to="/member/order/1002" >2</RouterLink> -->
    <!-- tabs组件 -->
    <ETabs v-model="activeName" @tabChange="changeTab">
      <ETabPanel
        v-for="item in orderStatus" :label="item.label" :name="item.name" :key="item.name"
      >
      </ETabPanel>
    </ETabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <!-- 根据订单类型查询订单数据，数据未显示，产生loading效果 -->
      <div v-if="loading" class="loading"></div>
      <!-- loading加载状态为false，且获取订单列表为空显示 暂无数据 -->
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem v-for="item in orderList" :key="item.id" :order="item"
        @onCancel="handlerCancel"
        @delOrder="handlerDelOrder"
        @onConfirm="handlerConfirm"
        @onLogistics="handlerLogistics"
      />
    </div>
    <!-- 分页组件 -->
    <EPaginationV2
      v-if="total > 0"
      :currentPages="reqParam.page"
      :pageSizes="reqParam.pageSize"
      :totalPage="total"
      @currentChange="currentChange"
    />
    <!-- 取消订单组件 -->
    <OrderCancel ref="cancel" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="logistics" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { delOrder, findOrderList, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics.vue'
export default defineComponent({
  name: 'MemberOrder',

  components: { OrderItem, OrderCancel, OrderLogistics },

  props: {},

  setup () {
    const activeName = ref('all')

    // 接收ETabs 的 tab栏切换事件
    const changeTab = (tab) => {
      console.log(tab)
      // 切换不同tab，发送不同的请求，但请求新的状态订单，初始页码为1
      reqParam.page = 1
      // 查询的订单状态
      reqParam.orderState = tab.index
    }
    // 查询订单参数
    const reqParam = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([]) // 订单列表
    const loading = ref(false) // loading效果的显示与隐藏
    const total = ref(0)
    // 同监听 reqParam 发送数据变化时，发送请求，重新加载数据
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParam).then(data => {
        console.log(data)
        orderList.value = data.result.items
        loading.value = false
        total.value = data.result.counts
      })
    }
    watch(reqParam, () => {
      console.log(reqParam.orderState)
      getOrderList()
    }, { immediate: true })

    // 页触发变化的时候，
    const currentChange = (currentPage) => {
      reqParam.page = currentPage
    }

    return {
      activeName,
      orderStatus,
      changeTab,
      orderList,
      loading,
      reqParam,
      total,
      currentChange,
      ...useCancel(),
      ...useDelOrder(getOrderList),
      ...useConfirm(),
      ...useLogistics()
    }
  }
})
// 模拟发货接口 https://apipc-xiaotuxian-front.itheima.net/member/order/consignment/1564445810258710529
// 取消订单逻辑
export const useCancel = () => {
  const cancel = ref(null) // 获取取消原因组件实例
  const handlerCancel = (order) => {
    console.log(order)
    cancel.value.open(order) // 打开orderCancel组件对话框
  }
  return {
    cancel,
    handlerCancel
  }
}
// 删除订单
const useDelOrder = (getOrderList) => {
  // 删除逻辑
  const handlerDelOrder = (order) => {
    Confirm({ title: '删除订单', text: '亲，你确认删除订单吗？' }).then(() => {
      delOrder(order.id).then(res => {
        console.log(res)
        Message({ type: 'success', text: '删除订单成功' })
        // 获取订单列表
        getOrderList()
      })
    }).catch(() => {})
  }
  return {
    handlerDelOrder
  }
}
// 确认收货订单
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ title: '确认收货', text: '亲，你确认收货订单吗？' }).then(() => {
      confirmOrder(order.id).then(res => {
        console.log(res)
        Message({ type: 'success', text: '确认收货成功' })
        // 待收货 变为 待评价
        order.orderState = 4
      })
    }).catch(() => {})
  }
  return {
    handlerConfirm
  }
}
// 查看物流信息
const useLogistics = () => {
  const logistics = ref(null)
  const handlerLogistics = (order) => {
    // 打开物流对话框
    logistics.value.open(order)
  }
  return {
    handlerLogistics,
    logistics
  }
}

</script>
<style lang='less' scoped>
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
