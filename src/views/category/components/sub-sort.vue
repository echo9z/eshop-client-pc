<!--
* @description 商品的排序组件
* @fileName sub-sort.vue
* @author echo9z
* @date 2022/07/04 09:48:33
!-->
<template>
  <div class='sub-sort'>
    <!-- 左侧商品排序按钮 -->
    <div class="sort">
      <a :class="{active:sortParams.sortField === null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active:sortParams.sortField === 'publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active:sortParams.sortField === 'orderNum'}" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{active:sortParams.sortField === 'evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up"
          :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}"
        /> <!-- 升序asc -->
        <i class="arrow down"
          :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}" />
      </a>
    </div>
    <!-- 右侧复选框组件 -->
    <div class="check">
      <ECheckBox v-model="sortParams.inventory"
        @change="changeCheck">仅显示有货商品</ECheckBox>
      <ECheckBox v-model="sortParams.onlyDiscount"
        @change="changeCheck">仅显示特惠商品</ECheckBox>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
export default defineComponent({
  name: 'SubSort',
  components: {},
  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    // 实现交互，点击相应的排序按钮，得到对应参数，根据参数请求数据
    // 1.交互数据
    let sortParams = reactive({
      inventory: false, // 显示有库存商品，默认不显示 右侧复选框按钮
      onlyDiscount: false, // 显示特惠商品
      /**
       * publishTime：最新发布商品
       * orderNum：订单排序 最高人气
       * evaluateNum：评论最多排序
       * price：价格排序
       */
      sortField: null, // 默认没有设置排序规则
      sortMethod: null // 传入商品价格，排序规则，asc为正序，desc为倒序，默认为desc
    })
    // 2.为每个 排序的a元素绑定点击事件，将交互数据中sortField设置对应的排序规则
    const changeSort = (sortField) => {
      // 处理点击价格排序逻辑
      if (sortField === 'price') {
        sortParams.sortField = sortField
        // 处理价格排序，第一次点击默认是 为desc降序，第二次点击不为null，如果未desc，取反为asc，如果为asc取反为desc
        sortParams.sortMethod = sortParams.sortMethod === null ? 'desc' : (sortParams.sortMethod === 'desc' ? 'asc' : 'desc')
      } else { // 其他按钮 比如 最新发布商品、最高人气、评论最多，直接赋值，同时将排序规则为null，不传默认为desc
        if (sortParams.sortField === sortField) return // 如果点击排序项等于原来的值，直接返回
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 点击触发筛选安娜请求数据，触发sortChange事件
      emit('sort-change', sortParams)
    }
    // 复选框的点击事件，触发父组件的sort-change事件
    const changeCheck = () => {
      emit('sort-change', sortParams)
    }
    watch(() => props.id, (newVal) => {
      if (newVal) {
        sortParams = reactive({
          inventory: false, // 显示有库存商品，默认不显示 右侧复选框按钮
          onlyDiscount: false, // 显示特惠商品
          sortField: null, // 默认没有设置排序规则
          sortMethod: null // 传入商品价格，排序规则，asc为正序，desc为倒序，默认为desc
        })
      }
    }, { immediate: true })
    return {
      sortParams,
      changeSort,
      changeCheck
    }
  }
})

</script>
<style lang='less' scoped>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
