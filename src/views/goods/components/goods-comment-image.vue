<!--
* @description 评论区图片组件
* @fileName goods-comment-image.vue
* @author echo9z
* @date 2022/07/14 18:21:09
!-->
<template>
  <div class="goods-comment-image">
    <div class="list">
      <!-- 遍历多个a标签，标签中出行多个img -->
      <!-- 点击的时候赋值 url -->
      <a
        href="javascript:;"
        v-for="(url,index) in pictures" :key="index"
        @click="currentImg = url"
      >
        <img :src="url" alt="">
      </a>
    </div>
    <div class="preview" v-if="currentImg">
      <!-- 将点击记录的图片url 赋值img标签 -->
      <img :src="currentImg" alt="">
      <!-- 记录的图片url 为null，则关闭图片 -->
      <i @click="currentImg = null" class="iconfont icon-close-new"></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'GoodsCommentImage',

  components: {},

  props: {
    // 传入图片
    pictures: {
      type: Array,
      default: () => []
    }
  },

  setup () {
    const currentImg = ref(null)
    return {
      currentImg
    }
  }
})

</script>
<style lang='less' scoped>
.goods-comment-image {
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border:1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }
  .preview { // 图片预览效果
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0,0,0,0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
