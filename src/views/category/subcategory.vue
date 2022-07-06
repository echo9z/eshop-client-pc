<!--
* @description 局部渲染的组件，二级分类显示的组件，比如点击美食下的 米面粮油 显示相关二级内容
* @fileName subcategory.vue
* @author echo9z
* @date 2022/06/17 16:55:19
!-->
<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread :id="id"></SubBread>
        <!-- 筛选区域 -->
        <SubFilter :id="id" @filterChange="filterChange" ></SubFilter>

      <!-- 排序按钮 和 商品加载区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort :id="id" @sortChange="sortChange" />
        <!-- 商品列表区域 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <SubGoodsItem :goods="goods"></SubGoodsItem>
          </li>
        </ul>
        <!-- 无限加载数据组件
          子组件触发自己绑定的infinite事件，infinite事件绑定的是 getData -->
        <EInfiniteLoading v-model="loading" :finished="finished" @infinite="getData" />
      </div>
      <!-- 处理change事件 -->
      <!-- <ECheckBox v-model="isChecked" @change="isCheckedA = $event" >全选</ECheckBox> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import SubGoodsItem from './components/category-goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
export default defineComponent({
  name: 'SubCategory',

  components: { SubBread, SubFilter, SubSort, SubGoodsItem },

  props: {
    // 二级分类id
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },

  setup (props) {
    // loading 加载状态
    const loading = ref(false)
    // finished 是否加载完毕
    const finished = ref(false)
    // 执行数据的请求逻辑
    const goodsList = ref([])
    // 请求参数
    let params = {
      page: 1, // 第一页数据
      pageSize: 20 // 一页显示20条
    }
    const getData = async () => {
      console.log('加载数据')
      // 1.发起数据请求
      params.categoryId = props.id
      const res = await findSubCategoryGoods(params)
      console.log(res)

      if (res.result.items.length) {
        goodsList.value.push(...res.result.items)
        // 上面数据返回完毕后，将加载状态loading为false，不然会一直处于数据加载状态
        // 如果数据存在，则请求下一页数据
        params.page += 1
      } else {
        // 没有数据
        finished.value = true
      }
      loading.value = false // 关闭本次数据加载状态
    }
    // 二级分类id变化，商品数据重新加载
    watch(() => props.id, (newVal) => {
      if (newVal) {
        // 重置数据
        goodsList.value = [] // 切换不懂
        params = {
          page: 1, // 第一页数据
          pageSize: 20 // 一页显示20条
        }
        finished.value = false
      }
    })
    // 1.排序条件发送变化时，重新调成请求参数，发送请求
    const sortChange = async (e) => {
      goodsList.value = [] // 将数组初始化为0
      // params = {
      //   page: 1, // 第一页数据
      //   pageSize: 20 // 一页显示20条
      // }
      params.page = 1
      finished.value = false
      params = { ...params, ...e }
      // params.inventory = e.inventory
      // params.onlyDiscount = e.onlyDiscount
      // params.sortField = e.sortField
      // params.sortMethod = e.sortMethod
    }
    // 2.筛选条件发送变化时，重新调成请求参数，发送请求
    const filterChange = (e) => {
      goodsList.value = [] // 将数组初始化为0
      // params = {
      //   page: 1, // 第一页数据
      //   pageSize: 20 // 一页显示20条
      // }
      params.page = 1
      finished.value = false
      console.log('过滤', e)
      params = { ...params, ...e }
    }
    return {
      loading,
      finished,
      goodsList,
      getData,
      sortChange,
      filterChange
    }
  }
})

</script>
<style lang='less' scoped>
.goods-list{
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
