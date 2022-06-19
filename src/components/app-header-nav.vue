<!--
* @description 头部公共的一级导航组件 首页 美食 居家 等等
* @fileName app-header-nav.vue
* @author echo9z
* @date 2022/06/17 11:25:11
!-->
<template>
  <ul class="app-header-nav">
    <li class="home"><router-link to="/">首页</router-link></li>
    <li v-for="item in categoryList" :key="item.id" @mouseenter="show(item)" @mouseleave="hide(item)">
      <!-- 一级类目 to一级分类要跳转的类目-->
      <!-- mouseenter鼠标进入， -->
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{item.name}}</router-link>
      <!-- 鼠标移动值一级类目显示layer，这里的类目，将准备好的数据渲染到dom结构中，通过添加类样式透明度 和 高度来控制隐藏和显示 -->
      <div class="layer" :class="{ open:item.open }">
        <ul>
          <li v-for="subItem in item.children" :key="subItem.id">
            <router-link :to="`/category/sub/${subItem.id}`" @click="hide(item)">
              <img :src="subItem.picture" alt="">
              <p>{{subItem.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
    <!-- <li><a href="#">餐厨</a></li>
    <li><a href="#">艺术</a></li>
    <li><a href="#">电器</a></li>
    <li><a href="#">居家</a></li>
    <li><a href="#">洗护</a></li>
    <li><a href="#">孕婴</a></li>
    <li><a href="#">服装</a></li>
    <li><a href="#">杂货</a></li> -->
  </ul>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'AppHeaderNav-Level1',

  components: {
  },

  props: {},

  setup () {
    const store = useStore()
    // 获取vuex category下的list数据
    const categoryList = computed(() => {
      return store.state.category.list
    })
    // 跳转时，不会关闭二分类的类目，需要通过数据控制
    // 1.每个分类添加一个open数据，用于控制鼠标进入时显示，移出时隐藏，点击一级和二级类目隐藏
    // 2.vuex提供隐藏和显示的函数，修改open数据
    // 3.在组件中使用vuex中函数，使用事件来绑定
    const show = (item) => {
      store.commit('category/show', item.id)
    }
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return {
      categoryList,
      show,
      hide
    }
  }
})

</script>
<style lang='less' scoped>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 999;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // 鼠标进过 显示二级类目
      // > .layer{
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
  .layer { // 到鼠标移动值一级类目，显示二级类目
    // 控制显示的类名
    &.open{  // .layer.open 交集，添加显示layer弹出层
      height: 132px;
      opacity: 1;
    }
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0; // 高度0
    opacity: 0; // 透明度0
    overflow: hidden;
    box-shadow: 0 0 5px #ccc;
    transition: all .2s .1s;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
}

</style>
