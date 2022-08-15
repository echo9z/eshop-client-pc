<!--
* @description 没有账号，需要完善相关信息 比如账户名 手机号
* @fileName callback-patch.vue
* @author echo9z
* @date 2022/07/29 14:05:57
!-->
<template>
  <Form ref="formRef" class="e-form" :validation-schema="schema" v-slot="{ errors }" autocomplete="off">
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err: errors.account}" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">{{time===0? '发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.password}" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.rePassword}" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="complementLogin()">立即提交</a>
  </Form>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import veeValidateSchema from '@/utils/vee-validate-schema'
import message from '@/components/library/Message'
import { userAccountRegisterMsg, userAccountCompleteInfo } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'CallbackPatch',

  components: { Form, Field },

  props: {
    unionId: { // QQ唯一标识
      type: String,
      default: ''
    }
  },

  setup (props) {
    // 1.表单校验 多出两个校验 用户是否存在，再次输入密码是否一致
    // 2.发的短信
    // 3.完善信息

    // 提交表单对象
    const form = reactive({
      account: null,
      password: null,
      rePassword: null,
      mobile: null,
      code: null
    })
    // 表单效验规则
    const schema = {
      account: veeValidateSchema.accountApi,
      password: veeValidateSchema.password,
      rePassword: veeValidateSchema.rePassword,
      mobile: veeValidateSchema.mobile,
      code: veeValidateSchema.code
    }

    const formRef = ref(null)
    // 倒计时60 短信定时器
    const time = ref(0) // 响应式数据，
    const { pause, resume } = useIntervalFn(() => {
      /* your function */
      // console.log(pause, resume, isActive)
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false }) // immediate立即开启定时器
    // 组件销毁时，清除定时器
    onMounted(() => {
      // clearInterval(timer)
      pause()
    })

    // 短信发送
    const send = () => {
      const valid = schema.mobile(form.mobile)
      if (valid === true) {
        // 没有倒计时不等于0，直接返回，等于0才可以发送短信
        if (time.value !== 0) return
        // 手机号码验证通过，调用api 获取验证码
        userAccountRegisterMsg(form.mobile).then(res => {
          if (res.msg === '操作成功') {
            message({ type: 'success', text: '短信已发送' })
            time.value = 60
            // 开启定时器
            resume()
          }
        }).catch(e => {
          message({ type: 'error', text: e.response.data.message || '发送失败' })
        })
      } else {
        formRef.value.setFieldError('mobile', valid)
      }
    }

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 绑定逻辑
    const complementLogin = async () => {
      const valid = await formRef.value.validate()
      if (valid) {
        try {
          let result = null
          // 发送的绑定请求
          // 1.准备信息
          // 2.调用api函数
          // 3.成功：跳转至来源页 或者 首页
          // 4.失败调用message
          const data = await userAccountCompleteInfo({
            unionId: props.unionId,
            ...form
          })
          result = data.result
          console.log(result)
          // 登录成功处理
          if (result) {
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
              const decodeURI = decodeURIComponent(route.query.redirectUrl)
              // 根据用户从哪里进入的登录页面，在跳转到原理的登录页
              router.push({ path: decodeURI === 'undefined' ? '/' : decodeURI })
              // 成功提示
              message({ type: 'success', text: 'QQ完善信息成功' })
            })
          }
        } catch (err) {
          console.log(err)
          if (err.response.data) {
            // 调用封装 message 自动创建message消息提示组件
            message({ type: 'error', text: err.response.data.message || 'QQ完善信息失败' })
          }
        }
      }
    }

    return {
      form,
      schema,
      formRef,
      time,
      send,
      complementLogin
    }
  }
})

</script>
<style lang='less' scoped>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
