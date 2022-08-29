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
      <OrderItem v-for="item in orderList" :key="item.id" :order="item" />
    </div>
    <!-- 分页组件 -->
    <EPaginationV2
      v-if="total > 0"
      :currentPages="reqParam.page"
      :pageSizes="reqParam.pageSize"
      :totalPage="total"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { findOrderList } from '@/api/order'
export default defineComponent({
  name: 'MemberOrder',

  components: { OrderItem },

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
    watch(reqParam, () => {
      console.log(reqParam.orderState)
      loading.value = true
      findOrderList(reqParam).then(data => {
        console.log(data)
        orderList.value = data.result.items
        loading.value = false
        total.value = data.result.counts
      })
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
      currentChange
    }
  }
})

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
