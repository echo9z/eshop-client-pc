<!--
* @description 购车为空展示组件
* @fileName cart-none.vue
* @author echo9z
* @date 2022/08/08 14:17:27
!-->
<template>
  <div class="cart-none">
    <img src="@/assets/images/none.png" alt="" />
    <p>购物车内暂时没有商品</p>
    <div class="btn">
      <EButton type="primary" @click="$router.push('/')">继续逛逛</EButton>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CartNone',

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.cart-none {
  text-align: center;
  padding: 150px 0;
  background: #fff;
  img {
    width: 180px;
  }
  p {
    color: #999999;
    padding: 20px 0;
  }
}
</style>
