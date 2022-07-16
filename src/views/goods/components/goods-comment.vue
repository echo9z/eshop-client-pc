<!--
* @description 商品评价组件
* @fileName goods-comment.vue
* @author echo9z
* @date 2022/07/12 19:56:58
!-->
<template>
  <div class="goods-comments">
    <!-- 商品评价的头部 评论具体数量-->
    <div class="head" v-if="commentInfo">
      <!-- 评论具体数量 -->
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <!-- 点击不同按钮 筛选出不同的评价内容 -->
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;"
            :class="{active:currentTag === index}"
            v-for="(tag,index) in commentInfo.tags"
            :key="index"
            @click="changeTag(index, tag)"
          >
            {{tag.title}}（{{tag.tagCount}}）
          </a>
          <!-- <a href="javascript:;">好吃（1000）</a>
          <a href="javascript:;">便宜（1000）</a>
          <a href="javascript:;">很好（1000）</a>
          <a href="javascript:;">再来一次（1000）</a>
          <a href="javascript:;">快递棒（1000）</a> -->
        </div>
      </div>
    </div>
    <!-- 商品点击按钮的排序功能 -->
    <div class="sort" v-if="total" >
      <span>排序：</span>
      <a href="javascript:;" :class="{active:reqParams.sortField === null}" @click="changeSort(null)">默认</a>
      <a href="javascript:;" :class="{active:reqParams.sortField === 'createTime'}" @click="changeSort('createTime')">最新</a>
      <a href="javascript:;" :class="{active:reqParams.sortField === 'praiseCount'}" @click="changeSort('praiseCount')">最热</a>
    </div>
    <!-- 商品的评价列表即 用户评价内容 -->
    <div class="list" v-if="commentList" >
      <div class="item" v-for="item in commentList" :key="item.id">
        <!-- 用户头像 昵称 -->
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickName(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <!-- icon-wjx01实心图标   icon-wjx02空心图标 -->
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="i in (5 - item.score)" :key="i" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 评论图片组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <div class="time">
            <!-- 评论事件 -->
            <span>{{item.orderInfo.createTime}}</span>
            <!-- 点赞按钮 -->
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 总行数 -->
    <EPaginationV2 v-if="total"
      :totalPage="total"
      :pageSizes="reqParams.pageSize"
      :currentPages="reqParams.page"
      @currentChange="changePager" />
  </div>
</template>

<script>
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
import { defineComponent, inject, reactive, ref, watch } from 'vue'
import GoodsCommentImage from './goods-comment-image.vue'
export default defineComponent({
  name: 'GoodsComment',

  components: { GoodsCommentImage },

  props: {
  },

  setup () {
    // 评价信息
    const commentInfo = ref(null)
    const goods = inject('goods')
    findGoodsCommentInfo(goods.value.id).then(res => {
      // 处理数据中tags 添加全部评价tag，有图评价tag
      // 在数组的第一个元素 添加tag
      res.result.tags.unshift({ title: '有图', tagCount: res.result.hasPictureCount, type: 'img' })
      res.result.tags.unshift({ title: '全部评价', tagCount: res.result.evaluateCount, type: 'all' })
      commentInfo.value = res.result
      console.log(commentInfo.value)
    })

    // 准备评论的筛选数据条件，是全部评价 还是 有图，排序是最新 或者 最热
    const reqParams = reactive({
      page: 1, // 默认评价第一页
      pageSize: 10, // 一页显示几条
      hasPicture: null, // 获取是否有图 字段为null，不会将hasPicture字段添加到请求当中
      tag: null, // 选取的标签内容 比如点击 质量不错tag标签； tag: '质量不错'
      sortField: null, // 排序字段，可选值范围[praiseCount,createTime]  praiseCount:获取最热评论 createTime:获取最新评论
      sortMethod: 'desc' // 排序的方式 默认是降序的 默认为desc
    })
    // 选中的tags标签，默认tags为第一项
    const currentTag = ref(0)
    /** 每个tag按钮的 点击筛选事件
     * index 记录点击tag索引位置
     */
    const changeTag = (index, tag) => {
      currentTag.value = index
      // 每次点击不同的筛选条件，都是从第一页开始
      reqParams.page = 1
      // 点击tag的时候修改筛选条件
      // 情况1：全部评价
      // 情况2：点击有图
      // 情况3：点击其他tag
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        // 正常情况下点击标签
        reqParams.tag = tag.title
        reqParams.hasPicture = null
      }
      console.log(reqParams)
      // 发送请求
    }

    // 排序按钮的切换
    const changeSort = (sortField) => {
      // 每次点击不同的排序条件，都是从第一页开始
      reqParams.page = 1
      reqParams.sortField = sortField
    }

    const commentList = ref([])
    const total = ref(0)
    // 评价组件初始发送 评论内容请求，筛选条件发送改变也发送请求
    watch(reqParams, () => {
      findGoodsCommentList(goods.value.id, reqParams).then((res) => {
        console.log(res.result)
        commentList.value = res.result.items
        total.value = res.result.counts
      })
    }, { immediate: true })

    // 处理用户评论中的 颜色：黑色 (对应vue2中的过滤器)
    const formatSpecs = (specs) => {
      return specs.reduce((str, spec) => `${str} ${spec.name}:${spec.nameValue}`, '').trim()
    }
    // 格式用户名称，隐藏用户名
    const formatNickName = (nickName) => {
      return nickName.substr(0, 1) + '****' + nickName.substr(-1) // subStr(-1) -1是取出字符串中最后一个字符
    }

    // 该事件，当分页组件发送变化时，触发changePager事件，修改 筛选参数中reqParams的page 页面，发起请求
    const changePager = (newPage) => {
      reqParams.page = newPage // 监听监听的reqParams数据发送改变时发送请求
    }
    return {
      commentInfo,
      currentTag,
      changeTag,
      reqParams,
      changeSort,
      commentList,
      total,
      formatSpecs,
      formatNickName,
      changePager
    }
  }
})

</script>
<style lang='less' scoped>
.goods-comments {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
  .list { // 评论列表内容
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
