<!--
* @description 顶部导航栏通用组件
* @fileName app-navbar.vue
* @author echo9z
* @date 2022/06/17 09:26:05
!-->
<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{profile.account}}</a></li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <!-- 上下这两个是根据用户的登录状态来确定要显示的标签 -->
        <template v-else>
          <li><a @click="login">请先登录</a></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>

        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'AppTopnav',
  setup () {
    // 根据用户信息，显示不同的登录标签，进行导航栏的切换
    const store = useStore()
    // 直接导出profile 不是响应式的，在vue2中，通过mapState导入compute中
    // const { profile } = store.state.user
    // 通过组合api 添加 profile，使用vuex中状态必须使用计算属性包裹
    const profile = computed(() => {
      return store.state.user.profile
    })
    console.log(profile)

    const router = useRouter()
    const login = () => {
      const fullPath = router.currentRoute.value.fullPath
      fullPath === '/' ? router.push({ path: '/login' }) : router.push({ path: '/login', query: { redirectUrl: encodeURIComponent(router.currentRoute.value.fullPath) } })
    }
    // 退出登录
    // 清空本地存储信息 和 vuex 用户信息
    const logout = () => {
      store.commit('user/setUser', {})
      router.push('/login')
    }
    return {
      profile,
      login,
      logout
    }
  }
})
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li { // ~ 选择器：选择li之后的所有兄弟节点，将li的兄弟节点下a标签添加border-left样式
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
