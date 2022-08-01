<!--
* @description 登录组件
* @fileName index.vue
* @author echo9z
* @date 2022/07/16 21:21:30
!-->
<template>
  <LoginHeader>欢迎登录</LoginHeader>
  <!-- 登录主体内容 白色的登录盒子 -->
  <section class="login-section">
    <div class="wrapper">
      <nav>
        <a href="javascript:;" :class="{active: activeName==='account'}" @click="activeName='account'">账户登录</a>
        <a href="javascript:;" :class="{active: activeName==='qrcode'}" @click="activeName='qrcode'">扫码登录</a>
      </nav>
      <!-- 账号登录 和 扫描登录 -->
      <!-- 表单 -->
      <LoginForm v-if="activeName==='account'" />
      <!-- 二维码 -->
      <div v-if="activeName==='qrcode'" class="qrcode-box">
        <img src="@/assets/images/qrcode.jpg" alt="">
        <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
      </div>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
import { defineComponent, ref } from 'vue'
import LoginHeader from './components/login-header.vue'
import LoginFooter from './components/login-footer.vue'
import LoginForm from './components/login-form.vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'LoginView',

  components: { LoginHeader, LoginFooter, LoginForm },

  props: {},

  setup () {
    // 默认是选中账号登录
    const activeName = ref('account')

    // 存储回跳地址
    // 来到登录页是存储redirectUrl来源页数据，存储到vuex中；便于如果通过QQ登录时候，成功登录跳转到来源页或者 首页
    const store = useStore()
    const route = useRoute()
    console.log()
    const decodeURI = decodeURIComponent(route.query.redirectUrl)
    const url = (decodeURI === 'undefined' ? '/' : decodeURI)
    console.log(url)
    store.commit('user/setRedirectUrl', url)
    return {
      activeName
    }
  }
})

</script>
<style lang='less' scoped>
.login-section {
  background: url(../../assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px,0,0);
    box-shadow: 0 0 10px rgba(0,0,0,.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active{
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
     // 二维码容器
    .qrcode-box {
      text-align: center;
      padding-top: 40px;
      p {
        margin-top: 20px;
        a {
          color: @xtxColor;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
