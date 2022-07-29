<!--
* @description qq登录回跳页面
* @fileName callback.vue
* @author echo9z
* @date 2022/07/29 10:59:11
!-->
<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 会跳页面主体部分 -->
  <section class="container">
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
      <CallbackBind />
    </div>
    <!-- 完善资料信息 用户名 手机号 性别等等 -->
    <div class="tab-content" v-else>
      <CallbackPatch />
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
export default defineComponent({
  name: 'LoginCallback',

  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },

  props: {},

  setup () {
    const hasAccount = ref(true)
    return {
      hasAccount
    }
  }
})

</script>
<style lang='less' scoped>
.container {
  padding: 25px 0;
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
