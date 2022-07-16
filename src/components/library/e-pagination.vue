<!--
* @description 分页组件
* @fileName e-pagination.vue
* @author echo9z
* @date 2022/07/15 10:01:20
!-->
<template>
  <div class="e-pagination">
    <!-- 理想化的分页组件 -->
    <a href="javascript:;" @click="changePage(-1)" :class="{ disabled: currentPage <= 1 }">上一页</a>
    <!-- 是否禁用，需要指导当前页码值是否等于1 -->
    <a href="javascript:;" v-if="currentPage >= 5" @click="currentPage = 1">1</a> <!-- 相当于首页 -->
    <span v-if="currentPage >= 5">...</span><!-- 是否显示：需要知道选中的按钮页面是否 >= 5 -->
    <!-- 需要知道中间显示几个按钮 比如 下面有5个按钮，通过选中来判断下面5个按钮的起始按钮 和 结束按钮 得到数组[3,4,5,6,7] 再进行渲染 -->
    <!-- <a href="javascript:;">3</a>
    <a href="javascript:;">4</a>
    <a href="javascript:;" class="active">5</a>
    <a href="javascript:;">6</a>
    <a href="javascript:;">7</a> -->
    <a href="javascript:;" v-for="page in middlePageArr" :key="page" :class="{ active: currentPage === page }"
      @click="currentPage = page">{{ page }}</a>

    <span v-if="currentPage <= 16">...</span><!-- 是否显示：需要知道选中的按钮页面是否 总页码 - 选中页页码 <= 5 -->
    <a href="javascript:;" v-if="currentPage <= 16" @click="currentPage = totalPage">{{ totalPage }}</a>
    <a href="javascript:;" @click="changePage(1)" :class="{ disabled: currentPage >= totalPages }">下一页</a>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'EPagination',

  components: {},

  props: {
    // 按钮个数 比如中间显示的页面个数
    btnPage: {
      type: Number,
      default: 5
    },
    totalPage: {
      type: Number,
      default: 20
    },
    currentPages: { // 选中页码值
      type: Number,
      default: 15
    }
  },

  setup (props) {
    // 需要 按钮个数比如中间显示的页面个数，当前页码，总页数，起始页码，结束页码，中间按钮的数组
    const count = ref(props.btnPage)
    // 当前选中页码，默认是显示的第一页
    const currentPage = ref(props.currentPages)
    // 总页数
    const totalPages = ref(props.totalPage)
    // 中间按钮的数组
    // const middlePageArr = ref([])
    // 上一页 下一页
    const changePage = (step) => {
      let newPage = currentPage.value + step
      if (newPage <= 1) {
        newPage = 1
      }
      if (newPage >= totalPages.value) {
        newPage = totalPages.value
      }
      currentPage.value = newPage
    }
    const middlePageArr = computed(() => {
      let arr = []
      if (currentPage.value < 5) {
        arr = [1, 2, 3, 4, 5, 6]
      } else if (currentPage.value > totalPages.value - 4) { // 16
        // arr = [15, 16, 17, 18, 19, 20]
        for (let i = 0; i < 6; i++) {
          arr.unshift(totalPages.value - i)
        }
      } else if (currentPage.value >= 5 || currentPage.value <= 16) { // 处理 之间位置，选中的按钮在 5-16 页码之间
        // 10 11 12 13 14     15 16 17 18 19 20
        for (let i = 0; i < 5; i++) {
          // 15-2 13 14 15 16 17
          arr.push(currentPage.value - 2 + i)
        }
      }
      return arr
    })
    return {
      count,
      currentPage,
      totalPages,
      middlePageArr,
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
