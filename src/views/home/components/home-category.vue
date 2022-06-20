<!--
* @description home左侧分类
* @fileName home-category.vue
* @author echo9z
* @date 2022/06/19 15:05:03
!-->
<template>
  <!-- 鼠标离开时将记录的categoryId至为null，移除进入li时，添加的背景样式 -->
  <div class='home-category' @mouseleave="categoryId = null">
    <ul class="menu">
      <!-- 有10行，即10个li -->
      <!-- active: categoryId === item.id处理的鼠标移除到弹出层，左侧对应分类id的背景也要添加 active样式-->
      <li :class="{active: categoryId === item.id}" v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <!-- 初始化时准备的为常量字符数组，是预先准备的数据，没有请求接口时，没有 children属性所有的添加v-if进行控制 -->
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">{{sub.name}}</RouterLink>
        </template>
      </li>
    </ul>
    <!-- 鼠标进入时，显示一个弹出层layer -->
    <!-- 弹层 -->
    <div class="layer">
      <!-- 分类标题 当展示的商品id是  -->
      <h4>{{currCategoryGoods && currCategoryGoods ? '品牌':'分类' }}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 判断当前currCategoryGoods.goods有值 -->
      <ul v-if="currCategoryGoods && currCategoryGoods.goods">
        <!-- 一个弹出层有9个商品 -->
        <li v-for="item in currCategoryGoods.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌自己的结构 -->
      <ul v-if="currCategoryGoods && currCategoryGoods.brands" >
        <li class="brand" v-for="brand in currCategoryGoods.brands" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{brand.nameEn}}</p>
              <p class="name ellipsis">{{brand.name}}</p>
              <p class="desc ellipsis-2">{{brand.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { findBrand } from '@/api/home'
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
      children: [{ id: 'brand-children', name: '品牌推荐' }], // item.children && 这里children有可能为空数据
      brands: [] // 品牌列表数据
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
      // console.log(category)
      // 将处理好category 数组，添加品牌数据
      category.push(brand)
      return category
    })

    // 得到分类下推荐商品数据
    const categoryId = ref(null)
    // 根据分类id，通过计算属性返回当前分类下商品数组
    const currCategoryGoods = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })
    // console.log(currCategoryGoods)
    // 获取品牌数据
    // setup不能是一个async函数: 因为返回值不再是return的对象, 而是promise, 模板看不到return对象中的属性数据
    findBrand().then(data => {
      console.log(data.result)
      // 给品牌对象进行赋值
      brand.brands = data.result
    })
    return {
      menuList,
      categoryId,
      currCategoryGoods
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
      &:hover, &.active{ // 鼠标进入是li的背景变绿
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
  .layer { // 10个分类 共用一个弹出层
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none; // 默认
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
       li.brand { // 品牌的样式 交集
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }
    }
  }
  // 鼠标进入 左侧商品分类
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
