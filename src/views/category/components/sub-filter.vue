<!--
* @description 商品的筛选
* @fileName sub-filter.vue
* @author echo9z
* @date 2022/06/29 18:44:11
!-->
<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <!-- 这里的if逻辑防止 品牌数据为空brands，为什么要大于1，原因是在数据返回时在每个brands添加一个全部对象，如果返回的数据brands自身有1个数据加上处理添加一个全部对象需要大于1 -->
    <template v-if="filterData.brands.length > 1 || filterData.saleProperties.length > 1">
      <div class="item"  >
        <!-- 筛选主体 比如品牌 尺寸 规格 -->
        <div class="head">品牌：</div>
        <!-- 筛选区的主体 -->
        <div class="body">
          <!-- 筛选主体下 若干个筛选选项的 即筛选条件 -->
          <a href="javascript:;" v-for="(item,index) in filterData.brands" :key="index"
            :class="{active: item.id === filterData.selectedBrands}"
            @click="changeBrand(item.id)">{{item.name}}</a>
        </div>
      </div>

      <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
        <!-- 筛选主体 比如品牌 尺寸 规格 -->
        <div class="head">{{item.name}}：</div>
        <!-- 筛选区的主体 -->
        <div class="body">
          <!-- 筛选主体下 若干个筛选选项的 即筛选条件 -->
          <a href="javascript:;" v-for="prop in item.properties" :key="prop.id"
            :class="{active: prop.id === item.selectedAttrs}"
            @click="changeProp(item, prop.id)">{{prop.name}}</a>
        </div>
      </div>
    </template>
    <!-- 防止brands为空，显示提示信息 -->
    <template v-else>
      <div class="sub-filter" >
        空如也
      </div>
    </template>
  </div>
  <!-- 处于数据筛选请求时，即filterLoading为true -->
  <div v-else class="sub-filter">
    <ESkeleton class="item" width="800px" height="40px"  />
    <ESkeleton class="item" width="800px" height="40px"  />
    <ESkeleton class="item" width="600px" height="40px"  />
    <ESkeleton class="item" width="600px" height="40px"  />
    <ESkeleton class="item" width="600px" height="40px"  />
  </div>
</template>

<script>
import { defineComponent, watch, ref } from 'vue'
import { findSubCategory } from '@/api/category'
export default defineComponent({
  name: 'SubFilter',

  components: {},

  props: {
    id: { // 通过路由导航获取，路由参数
      type: String,
      required: true
    }
  },
  emits: ['filter-change'],
  setup (props, { emit }) {
    // 监听二级类目id变化
    const filterData = ref(null)
    // 加载骨架屏效果，通过loading属性来控制骨架屏的效果
    const filterLoading = ref(false) // 调用接口发送请求前，没有数据返回，将值改为true，显示骨架屏效果
    const getSubCategory = () => {
      filterLoading.value = true
      findSubCategory(props.id).then(res => {
        console.log(res.result)
        // 每一组可选的筛选条件缺失 全部条件，处理res的数据
        if (res.result.brands) {
          // id等于 null，如果用户点击某个筛选项，根据商品的id 发送请求，获取商品
          // 给brands数组添加一个属性，用于记录是否选中
          res.result.selectedBrands = null // 品牌组的选中属性
          // 品牌
          res.result.brands.unshift({ id: null, name: '全部' })
          // 筛选属性
          res.result.saleProperties.forEach(prop => { // 比如item是规格
            prop.selectedAttrs = null // 每个筛选组 的选中属性
            prop.properties.unshift({ id: null, name: '全部' })
          })
        }
        filterData.value = res.result
      }).finally(() => {
        // 数据处理完毕返回后，隐藏骨架屏
        filterLoading.value = false
      })
    }
    // 如果切换到不同二级分类id，重新发起筛选数据的请求
    watch(() => props.id, (newId) => {
      // 使用useRoute 获取路由的id if(newVal && `/category/sub/${newVal}` === route.path)
      if (newId) getSubCategory()
    }, { immediate: true })

    // 获取筛选参数函数
    // {attrs: [{groupName: "规格", propertyName: "全部"}, {groupName: "口味", propertyName: "全部"}], brandId: "4"}
    const getFilterParams = () => {
      // 请求筛选需要的参数
      // 请求筛选的参数
      const filterParams = {}
      const attrs = [] // 其他属性条件数组
      // 品牌id
      filterParams.brandId = filterData.value.selectedBrands
      // 销售属性参数 需要两个字段，比如 选择规格这项，规格下面有 10袋/5g名称
      filterData.value.saleProperties.forEach(prop => {
        if (prop.selectedAttrs) {
          // 根据选项的id 等于 选中的selectedAttrs，找到选中属性对象
          const attr = prop.properties.find(option => option.id === prop.selectedAttrs)
          attrs.push({
            groupName: prop.name, // 属性组名称，比如规格
            propertyName: attr.name // 规格下名称，比如 5g/1袋
          })
        }
      })
      // 将attr 条件到filterParams对象中
      if (attrs.length) filterParams.attrs = attrs
      if (attrs.length === 0) filterParams.attrs = null
      return filterParams
    }

    // 品牌点击事件
    const changeBrand = (brandId) => {
      // 如果选中的id 与 原来的id 相等，直接放回
      if (filterData.value.selectedBrands === brandId) return
      // 记录下选中的 点击的那个筛品牌的id项
      filterData.value.selectedBrands = brandId

      emit('filter-change', getFilterParams())
    }
    // prop筛选项 点击事件   item：当前行的prop 项，id：选中当前行中某一个项的 id
    const changeProp = (item, id) => {
      if (item.selectedAttrs === id) return
      // 记录选中的 prop 销售属性的id
      item.selectedAttrs = id
      emit('filter-change', getFilterParams())
    }
    return {
      filterData,
      filterLoading,
      changeBrand,
      changeProp
    }
  }
})

</script>
<style lang='less' scoped>
 // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .e-skeleton {
      padding: 10px 0;
    }
  }
</style>
