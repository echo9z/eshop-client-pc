<!--
* @description qq登录回跳页面
* @fileName callback.vue
* @author echo9z
* @date 2022/07/29 10:59:11
!-->
<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 已绑定处于的加载loading效果 -->
  <section  class="container" v-if="isBand">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!-- 会跳页面主体部分，未绑定显示的 -->
  <section class="container" >
    <!-- 两个tab栏的切换 -->
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <!-- 完善绑定手机号 -->
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <!-- 完善资料信息 用户名 手机号 性别等等 -->
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { defineComponent, ref } from 'vue'
import LoginHeader from './components/login-header.vue'
import LoginFooter from './components/login-footer.vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import message from '@/components/library/Message'
export default defineComponent({
  name: 'LoginCallback',

  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },

  props: {},

  setup () {
    const hasAccount = ref(true)
    const router = useRouter()
    const store = useStore()
    // 首先：默认通过qq登录，已经注册本网站账号，和已绑定手机号码
    // 当用户点击qq 登录qq进行qq授权，完成返回callback页面
    // 通过QQ的api 来获取openId，该openId就是后台需要的unionId然后进行本网站的登录，拿着个unionId去后台查询，是否存在，存在则绑定了QQ号
    // 如果成功：说明qq号 已和 本网站账号进行过绑定，直接登录跳转到来源页或者 首页
    // 如果失败：该qq 未和 本网站账号进行绑定（有账号未绑定QQ号，没有账号未绑定QQ号）
    const isBand = ref(true) // 默认是账号是已经绑定了，这个状态用户显示跳转回来正在请求一个loading效果
    const unionId = ref(null) // 传入给callback-bind组件
    if (QC.Login.check()) { // check()方法，判断用户是否通过QQ已经认证登录了
      // openId用户身份的唯一标识，也是QQ唯一标识
      // accessToken表示当前用户在此网站/应用的登录状态与授权信息，
      QC.Login.getMe((openId, accessToken) => {
        unionId.value = openId
        // 请求小兔仙后台，进行本网站的登录
        userQQLogin(openId).then(data => {
          // 登录成功：data.result 用户信息
          const { result } = data
          console.log(data)
          // 1.存储用户信息
          // 2.跳转到来源页 或者 首页
          // 3.成功提示
          // 将用户登录信息存储到 storage 中
          store.commit('user/setUser', {
            id: result.id,
            avatar: result.avatar,
            nickname: result.nickname,
            account: result.account,
            mobile: result.mobile,
            token: result.token
          })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl)
            message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(err => {
          // 登录失败：小兔仙账号绑定过
          console.log(err)
          isBand.value = false // 登录失败
        })
      })
    }
    return {
      hasAccount,
      isBand,
      unionId
    }
  }
})

</script>
<style lang='less' scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  // 跳转会callback页面时，loading样式效果
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
