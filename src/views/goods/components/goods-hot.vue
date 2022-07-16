<!--
* @description 商品侧边栏 热榜
* @fileName goods-hot.vue
* @author echo9z
* @date 2022/07/13 10:22:30
!-->
<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodsList">
      <CategoryGoodsItem v-for="goods in goodsList" :key="goods.id" :goods="goods" />
    </div>
  </div>
</template>

<script>
import CategoryGoodsItem from '@/views/category/components/category-goods-item.vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import { findGoodsHot } from '@/api/product'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'GoodsHot',

  components: { CategoryGoodsItem },

  props: {
    // 根据接口 传入类型 确定是 24 还是 周 只是总
    // 1为24小时，2为周榜，3为总榜，默认为1
    type: {
      type: Number,
      default: 1
    }
  },

  setup (props) {
    // 根据传入的数据确定是 24小时热榜 还是 周热销榜 总销售热榜
    const types = reactive({
      1: '24小时热销榜',
      2: '周热销榜',
      3: '总热销榜'
    })
    const title = computed(() => {
      return types[props.type]
    })

    const goodsList = ref([]) // 商品列表
    const route = useRoute()
    // 获取热销商品数据
    findGoodsHot({ id: route.params.id, type: props.type }).then(res => {
      goodsList.value = res.result
    })
    return {
      title,
      goodsList
    }
  }
})

</script>
<style lang='less' scoped>
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) { // 重置的 category商品组件的样式
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
