<!--
* @description 已有账号，只需绑定手机号码
* @fileName callback-bind.vue
* @author echo9z
* @date 2022/07/29 14:09:35
!-->
<template>
  <Form ref="bindRef" class="e-form" :validation-schema="schema" v-slot="{ errors }" autocomplete="off">
    <div class="user-info">
      <!-- 数据来源于qq返回的头像 和 昵称 -->
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" class="input" v-model="form.mobile" name="mobile" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="e-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" class="input" v-model="form.code"  name="code"  type="text" placeholder="短信验证码" />
        <span class="code" @click="send">{{time === 0 ? '发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="bindLogin">立即绑定</a>
  </Form>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import veeValidateSchema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { userQQLoginBindMsg, userQQLoginMobileBind } from '@/api/user'
import message from '@/components/library/Message'
import QC from 'qc'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  name: 'CallbackBind',

  components: { Form, Field },

  props: {
    unionId: {
      type: String,
      default: ''
    }
  },

  setup (props) {
    // 1.准unionId(openId) qq头像 和 昵称
    // 2.完成表单效验
    // 3.发短信验证码（效验，定义api，调用，完成倒计时）
    // 4.进行绑定（绑定成功，就是登录成功）
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => { // 获取成功res返回用户头像信息
        console.log(res)
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }
    // 提交表单对象
    const form = reactive({
      mobile: null,
      code: null
    })

    const bindRef = ref(null) // 整个Form表单对象
    // 表单校验
    const schema = {
      mobile: veeValidateSchema.mobile,
      code: veeValidateSchema.code
    }

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
        userQQLoginBindMsg(form.mobile).then(res => {
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
        bindRef.value.setFieldError('mobile', valid)
      }
    }

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 绑定逻辑
    const bindLogin = async () => {
      const valid = await bindRef.value.validate()
      if (valid) {
        try {
          let result = null
          // 发送的绑定请求
          // 1.准备信息
          // 2.调用api函数
          // 3.成功：跳转至来源页 或者 首页
          // 4.失败调用message
          const data = await userQQLoginMobileBind({
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
            const decodeURI = decodeURIComponent(route.query.redirectUrl)
            // 根据用户从哪里进入的登录页面，在跳转到原理的登录页
            router.push({ path: decodeURI === 'undefined' ? '/' : decodeURI })
            // 成功提示
            message({ type: 'success', text: 'QQ绑定成功' })
          }
        } catch (err) {
          console.log(err)
          if (err.response.data) {
            // 调用封装 message 自动创建message消息提示组件
            message({ type: 'error', text: err.response.data.message || '登录失败' })
          }
        }
      }
    }

    return {
      nickname,
      avatar,
      form,
      schema,
      bindRef,
      time,
      send,
      bindLogin
    }
  }
})

</script>
<style lang='less' scoped>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
