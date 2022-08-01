// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登录后的回调低至
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息对象，payload就是用户信息对象
    setUser (state, payload) {
      state.profile = payload
    },
    setRedirectUrl (state, redirectUrl) {
      state.redirectUrl = redirectUrl
    }
  }
}
