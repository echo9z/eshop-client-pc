<!--
* @description 分页组件
* @fileName e-pagination-v2.vue
* @author echo9z
* @date 2022/07/15 10:01:20
!-->
<template>
  <div class="e-pagination">
    <!-- 理想化的分页组件 -->
    <a href="javascript:;" @click="currentPage = 1">首页</a> <!-- 相当于首页 -->
    <a href="javascript:;" @click="changePage(currentPage-1)" :class="{ disabled: currentPage <= 1 }">上一页</a>
    <!-- 是否禁用，需要指导当前页码值是否等于1 -->
    <span v-if="pager.start > 1">...</span><!-- 是否显示：需要知道选中的按钮页面是否 >= 5 -->
    <!-- 需要知道中间显示几个按钮 比如 下面有5个按钮，通过选中来判断下面5个按钮的起始按钮 和 结束按钮 得到数组[3,4,5,6,7] 再进行渲染 -->
    <!-- <a href="javascript:;">3</a>
    <a href="javascript:;">4</a>
    <a href="javascript:;" class="active">5</a>
    <a href="javascript:;">6</a>
    <a href="javascript:;">7</a> -->
    <a href="javascript:;" v-for="page in pager.btnArr" :key="page"
      :class="{ active: currentPage === page }"
      @click="changePage(page)"
    >
      {{ page }}
    </a>

    <span v-if="pager.end < pager.pageCount">...</span><!-- 是否显示：需要知道选中的按钮页面 是否 总页码 - 选中页页码 <= 5 -->
    <a href="javascript:;" @click="changePage(currentPage+1)" :class="{ disabled: currentPage >= pager.pageCount }">下一页</a>
    <a href="javascript:;" @click="currentPage = pager.pageCount">尾页</a>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'EPaginationV2',

  components: {},

  props: {
    totalPage: { // 一共有多少行，一共有100行数据
      type: Number,
      default: 100
    },
    pageSizes: { // 一页有多少行
      type: Number,
      default: 10
    },
    currentPages: { // 选中页码值
      type: Number,
      default: 1
    }
  },

  setup (props, { emit }) {
    // 需要 按钮个数比如中间显示的页面个数，当前页码，总页数，起始页码，结束页码，中间按钮的数组
    const count = ref(5) // 默认中间的按钮是5
    // 当前选中页码，默认是显示的第一页
    const currentPage = ref(props.currentPages)
    // 总页数 = 总条数 / 每一页条数  向上取整
    const total = ref(100)
    const pageSize = ref(10)

    // 切换分页函数 跳转点击page页 或 上一页 或 下一页
    const changePage = (page) => {
      let newPage = page
      console.log(newPage)
      if (newPage <= 1) {
        newPage = 1
      }
      if (newPage >= Math.ceil(total.value / pageSize.value)) {
        newPage = Math.ceil(total.value / pageSize.value)
      }
      currentPage.value = newPage
      // 每次currentPage 页码发送变化时，触发change事件
      emit('currentChange', currentPage.value)
    }

    // 其他数据
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(total.value / pageSize.value)
      // 中间按钮的数组 和 当前的页码 => 起始按钮，结束按钮，按钮数组
      // 理想情况下，比如 按钮个数是 5，起始元素 [3, 4, 5, 6, 7]，如果按钮个数是6，起始元素 [3, 4, 5, 6, 7, 8]
      const offset = Math.floor(count.value / 2)
      let start = currentPage.value - offset // 1-2 此时第5页 5-2 元素就是 3,4,5,6,7  6-3元素就是 3,4,5,6,7,8
      let end = count.value + start - 1 // 5+3-1 数组中最后一个元素7，6+3-1 数组中最后一个元素8

      // 如果起始页的页面小于 1，不合法页面 需要处理
      if (start < 1) {
        start = 1
        // 结束页面如果大于 总页数，比如总页数只有 4个， 5+1-1 > 4
        end = (count.value + start - 1) > pageCount ? pageCount : (count.value + start - 1)
      }
      // 如果结束页面 大于 总页数，结束页直接等于 总页数
      if (end > pageCount) {
        end = pageCount
        // 比如 总页数4，结束页是4， 4-4 + 1 = 1，页码数就 1,2,3,4
        start = (end - count.value + 1) < 1 ? 1 : (end - count.value + 1)
      }
      // 得到start起始按钮索引 和 end结束按钮索引，遍历得到中间按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount,
        btnArr,
        start,
        end
      }
    })

    // 监听props变化
    watch(props, () => {
      console.log('改变了')
      // 当父组件传入数据时，改为total
      total.value = props.totalPage // 一共有多少条数据
      pageSize.value = props.pageSizes // 一共有多少条数据
      currentPage.value = props.currentPages // 一共有多少条数据
    }, { immediate: true })
    return {
      currentPage,
      pager,
      changePage
    }
  }
})

</script>
<style lang='less' scoped>
.e-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;

  >a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;

    &:hover {
      color: @xtxColor;
    }

    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;

      &:hover {
        color: #333
      }
    }
  }

  >span {
    margin-right: 10px;
  }
}
</style>
