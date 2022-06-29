<!--
* @description 局部渲染的组件，一级分类显示的组件，比如点击美食显示美食相关内容
* @fileName index.vue
* @author echo9z
* @date 2022/06/17 16:50:31
!-->
<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <EBread>
        <EBreadItem :to="{path:'/'}" >首页</EBreadItem>
        <EBreadItem :to="`/category/${id}`" >{{topCategory.name}}</EBreadItem>
      </EBread>
      <!-- 轮播图 -->
      <ECarousel :sliders="sliders" style="height:500px" autoPlay />
      <!-- 所有二级分类 这里加条件判断，可能还在等等数据请求返回，可能数据不存在，加个条件判断 -->
      <div class="sub-list" >
        <h3>全部分类</h3>
        <ul>
          <!-- 遍历二级分类 -->
          <li v-for="sub in topCategory.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" >
              <p>{{sub.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <!-- 各个分类推荐商品 -->
      <div class="ref-goods" v-for="item in byCategory.children" :key="item.id">
        <template v-if="item.goods.length">
          <div class="head">
            <h3>- {{item.name}} -</h3>
            <p class="tag">温暖柔软，品质之选</p>
            <EMore :path="`/category/sub/${item.id}`" />
          </div>
          <div class="body">
            <!-- 每个一级分类下的 二级分类的推荐商品 goods -->
            <CategoryGoodsItem v-for="goods in item.goods" :goods="goods" :key="goods.id" />
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import CategoryGoodsItem from './components/category-goods-item.vue'
import { findTopCategory } from '@/api/category'
export default defineComponent({
  name: 'TopCategory',

  components: {
    CategoryGoodsItem
  },

  props: {
    id: { // 通过路由导航获取，路由参数，如果不配置路由导航 可用通过 route.params.id
      type: String,
      required: true
    }
  },

  setup (props) {
    // 面板屑
    const store = useStore()
    console.log(store.state.category.list)
    const topCategory = computed(() => {
      let cate = {}
      // 获取到一级分类 根据路由传参
      const findItem = store.state.category.list.find(item => {
        // console.log(item.id, props.id)  页面加载是category中的list数据是静态
        return item.id === props.id
      })
      // 如果findItem不为空，对cate进行赋值
      if (findItem) cate = findItem
      return cate
    })

    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      // 将数据赋值给sliders
      console.log(data.result)
      sliders.value = data.result
    })

    // 一级分类下的 二级分类下的商品推荐数据，但是在何时进数据请求？
    // 在组件初始化时发送请求，但是只有在不同路由规则才能初始化组件，比如 /home 跳转至 /category/12，会初始化组件
    // /category/12 跳转值 /category/54，就不会初始化当前组件，setup函数是只有在组件创建时执行
    // 监听地址栏id的变化，然后变化了就去加载数据，但是初始化有不会加载了。
    // 不过watch提供了 immediate: true 可让watch初始化的时候主动触发一次。
    const byCategory = ref([])
    const findCate = () => {
      findTopCategory(props.id).then(res => {
        console.log(res)
        byCategory.value = res.result
      })
    }
    watch(() => props.id, newId => {
      // 每次发送变化时，调用api获取对应一级分类推荐商品
      newId && findCate() // newId的id存在的时候再去发送请求
    }, { immediate: true })
    console.log(1)
    return {
      sliders,
      topCategory,
      byCategory
    }
  }
})

</script>
<style lang='less' scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods { // 推荐商品分类
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .e-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
