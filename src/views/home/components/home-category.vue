<!--
* @description home左侧分类
* @fileName home-category.vue
* @author echo9z
* @date 2022/06/19 15:05:03
!-->
<template>
  <div class='home-category'>
    <ul class="menu">
      <!-- 有10行，即10个li -->
      <li v-for="item in menuList" :key="item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <!-- 初始化时准备的为常量字符数组，是预先准备的数据，没有请求接口时，没有 children属性所有的添加v-if进行控制 -->
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">{{sub.name}}</RouterLink>
        </template>
      </li>
    </ul>
    <!-- 鼠标进入时的一个弹出层 -->
  </div>
</template>

<script>
import { defineComponent, computed, reactive } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'HomeCategory',

  components: {},

  props: {},

  setup () {
    const store = useStore()
    // 最终使用的数据= 9个分类+ 1个品牌
    // 品牌数据---数据也是响应式的
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-children', name: '品牌推荐' }] // item.children && 这里
    })
    // 9个分类
    const menuList = computed(() => {
      // 处理数据 每个一级分类下的子分类 children中只有 两个二级分类用于数据展示
      const category = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2), // item.children && 这里children有可能为空数据
          goods: item.goods
        }
      })
      console.log(category)
      // 将处理好category 数组，添加品牌数据
      category.push(brand)
      return category
    })
    return {
      menuList
    }
  }
})

</script>
<style lang='less' scoped>
.home-category { // home左侧分类
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
