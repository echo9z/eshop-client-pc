<!--
* @description 登录表单组件
* @fileName login-form.vue
* @author echo9z
* @date 2022/07/25 16:39:01
!-->
<template>
  <div class="account-box">
    <!-- 切换登录 -->
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- autocomplete="off" 关闭提示框 -->
    <Form ref="formRef" class="form" :validation-schema="schema" v-slot="{ errors }" autocomplete="off">
      <!-- 账户登录 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}"
              name="account"
              v-model="form.account"
              type="text" placeholder="请输入用户名或手机号" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
          <!-- <div class="error"><i class="iconfont icon-warning" />请输入手机号</div> -->
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password"  name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <!-- 短信登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" v-model="form.mobile"  name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send()"> {{time===0?'发送验证码':`${time}秒后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- 复选框 -->
          <Field as="ECheckBox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <a href="javascript:;" @click="login" class="btn">登录</a>
    </Form>
    <!-- 登录按钮 -->
    <div class="action">
      <!-- 用qq登录 -->
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import veeValidateSchema from '@/utils/vee-validate-schema'
import message from '@/components/library/Message'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
// import QC from 'qc'
export default defineComponent({
  name: 'LoginForm',

  components: { Form, Field },

  props: {
  },

  setup () {
    // 是否使用短信登录，默认账号登录
    const isMsgLogin = ref(false)

    // 表单信息对象，用于提交登录属性信息
    const form = reactive({
      isAgree: true, // 默认是通用协议
      account: 'xiaotuxian001',
      password: '123456',
      mobile: '13219165182',
      code: '123456'
    })

    // 校验规则对象
    // vee-validate 校验基本步骤
    // 1. 导入 Form Field 组件 将 form 和 input 进行替换，需要加上name用来指定将来的校验规则函数的
    // 2. Field 需要进行数据绑定，字段名称最好和后台接口需要的一致
    // 3. 定义Field的name属性指定的校验规则函数，Form的validation-schema接受定义好的校验规则是对象
    // 4. 自定义组件需要校验必须先支持v-model 然后Field使用as指定为组件名称
    const schema = {
      account: veeValidateSchema.account,
      password: veeValidateSchema.password,
      mobile: veeValidateSchema.mobile,
      code: veeValidateSchema.code,
      isAgree: veeValidateSchema.isAgree
    }

    // 切换短信登录还是账号登录，监听 isMsgLogin 的变化，重置提交表单数据
    const formRef = ref(null) // 获取Form实例
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果没有销毁field组件，之前的效验结果是不会清除的，比v-show切换显示元素
      // Form组件体 提供resetForm函数 清除效验的结果，即errors属性信息
      formRef.value.resetForm()
    })

    // setup中获取组件实例 proxy，在vue中直接同 this使用，在vue3中通过getCurrentInstance获取代理组件实例
    // const { proxy } = getCurrentInstance()
    // proxy.$message({ text: '111' })
    const store = useStore()
    const router = useRouter() // 调路由方法的
    const route = useRoute() // 调路由信息

    // 点击登录的时候，对整体表单进行效验
    const login = async () => {
      // Form组件提供一个 validate 函数，作为整体表单效验，返回的是一个promise对象，对象中结果来判断是效验成功还是效验失败
      const valid = await formRef.value.validate()
      if (valid) {
        // 就可以找到我们刚才挂载的方法了
        //  proxy.$message({ text: '111' })
        try {
          let result = null
          if (!isMsgLogin.value) { // 账户登录
            // 发送的登录请求
            // 1.准备用户登录信息
            // 2.调用api函数
            // 3.成功：跳转至来源页 或者 首页
            // 4.失败调用message
            const data = await userAccountLogin({
              account: form.account,
              password: form.password
            })
            result = data.result
          } else {
            // 短信登录
            console.log('短信登录')
            // 手机登录
            // 1.准备手机登录信息
            // 2.调用api函数
            // 3.成功：跳转至来源页 或者 首页
            // 4.失败调用message
            const data = await userMobileLogin({
              mobile: form.mobile,
              code: form.code
            })
            result = data.result
          }
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
            // 根据用户从哪里进入的登录页面，在跳转到原理的登录页
            router.push({ path: decodeURIComponent(route.query.redirectUrl) && '/' })
            // 成功提示
            message({ type: 'success', text: '登录成功' })
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

    // 使用 useIntervalFn pause暂停，resume开始
    // useIntervalFn(回调函数, 执行间隔时间, 是否立即开启)
    const time = ref(0) // 响应式数据，
    const { pause, resume } = useIntervalFn(() => {
      /* your function */
      // console.log(pause, resume, isActive)
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    // 组件销毁时，清除定时器
    onMounted(() => {
      // clearInterval(timer)
      pause()
    })

    // 发的短信验证码逻辑
    // 绑定发送验证码按钮点击事件
    // 效验手机号，如果成功则去发送短信（定义发送短信api），请求成功后开启60秒倒计时，发送短信按钮处于禁用状态
    // 如果验证码失败，则给出提示信息
    const send = () => {
      const valid = veeValidateSchema.mobile(form.mobile) // 将表单中手机号码进行校验
      if (valid === true) {
        // 没有倒计时不等于0，直接返回，等于0才可以发送短信
        if (time.value !== 0) return
        // 手机号码验证通过，调用api 获取验证码
        userMobileLoginMsg(form.mobile).then(res => {
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
        // 失败，使用vee的错误函数 显示错误提示 setFieldError(字段名称, 设置错误信息)
        // useForm()提供的.setFieldError() vee版本在4.6
        formRef.value.setFieldError('mobile', valid)
      }
    }

    // 初始 qq登录按钮
    // 1. 准备span有id = qqLoginBtn按钮
    // 2. QC.Login({btnId: "qqLoginBtn"})
    // onMounted(() => {
    //   QC.Login({ btnId: 'qqLoginBtn' })
    // })

    /* // 发的短信验证码 按钮逻辑
    const time = ref(0) // 用于倒计时展示
    let timer = null
    const send = () => {
      const valid = veeValidateSchema.mobile(form.mobile) // 将表单中手机号码进行校验
      if (valid === true) {
        if (time.value !== 0) return
        // 手机号码验证通过，调用api 获取验证码
        userMobileLoginMsg(form.mobile).then(res => {
          if (res.msg === '操作成功') {
            message({ type: 'success', text: '短信已发送' })
            // 开启器到期时
            time.value = 60
            clearInterval(timer)
            timer = setInterval(() => {
              time.value-- // 每隔一秒 对time减 1
              if (time.value <= 0) { // 等于1，停止定时器
                clearInterval(timer)
              }
            }, 1000)
          }
        }).catch(e => {
          message({ type: 'error', text: e.response.data.message || '发送失败' })
        })
      } else {
        // 失败，使用vee的错误函数 显示错误提示 setFieldError(字段名称, 设置错误信息)
        // useForm()提供的.setFieldError() vee版本在4.6
        formRef.value.setFieldError('mobile', valid)
      }
    } */
    return {
      isMsgLogin,
      form,
      schema,
      formRef,
      login,
      send,
      time
    }
  }
})

</script>
<style lang='less' scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
