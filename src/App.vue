<template>
  app {{$store.state.user.profile.account}} <br>
  <button @click="$store.commit('user/setUser',{account: 'lili'})">设置用户信息</button>
  <p>{{$router.currentRoute.value.fullPath}}</p>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'App',

  components: {},

  props: {},

  setup () {
    const router = useRouter()
    console.log(router)
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
