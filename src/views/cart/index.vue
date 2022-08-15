<!--
* @description 购物车页面
* @fileName index.vue
* @author echo9z
* @date 2022/08/05 11:50:01
!-->
<template>
  <div class="e-cart-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <EBread>
        <EBreadItem to="/">首页</EBreadItem>
        <EBreadItem>购物车</EBreadItem>
      </EBread>
      <!-- 购物车主体内容 -->
      <div class="cart">
        <table>
          <!-- 商品标题 -->
          <thead>
            <tr>
              <th width="120"><ECheckBox :modelValue="$store.getters['cart/isCheckAll']" @change="checkAll($event)" >全选</ECheckBox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0">
            <!-- 占满6列 -->
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
              <!-- 每个购物车商品的选择状态 -->
              <td><ECheckBox :modelValue="goods.selected" @change="($event) => checkOne(goods.skuId, $event)" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`"><img :src="goods.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{goods.name}}</p>
                    <!-- 选择规格组件 -->
                    <CartSku @change="($event) => updateCartSku(goods.skuId, $event)" :skuId="goods.skuId" :attrsText="goods.attrsText"  />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{goods.nowPrice}}</p>
                <!-- 原价加入时的价格大于现价 -->
                <p v-if="goods.price - goods.nowPrice > 0 ">比加入时降价 <span class="red">&yen;{{goods.price - goods.nowPrice}}</span></p>
              </td>
              <td class="tc">
                <!-- 修改数量组件 -->
                <ENumBox :max="goods.stock" :modelValue="Number(goods.count)" @changeNum="($event) => changeCount(goods.skuId, $event)" />
              </td>
              <td class="tc"><p class="f16 red">&yen;{{Math.round(goods.nowPrice * 1000 * Number(goods.count) / 1000)}}</p></td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="delCart(goods.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="i in $store.getters['cart/invalidList']" :key="i.skuId">
              <!-- 无效商品就不需要显示 -->
              <td><ECheckBox style="color:#eee;" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt=""/>
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{goods.name}}</p>
                    <p class="attr">{{goods.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;{{goods.nowPrice}}</p></td>
              <td class="tc">{{goods.count}}</td>
              <td class="tc"><p>&yen;{{Math.round(goods.nowPrice * 1000 * goods.count / 1000)}}</p></td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <ECheckBox :modelValue="$store.getters['cart/isCheckAll']" @change="checkAll($event)" >全选</ECheckBox>
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{$store.getters['cart/validTotal']}} 件商品，已选择 {{$store.getters['cart/selectedTotal']}} 件，商品合计：
          <span class="red">¥{{$store.getters['cart/validAmount']}}</span>
          <EButton type="primary">下单结算</EButton>
        </div>
      </div>
      <!-- 猜你喜欢 没有传商品id，就是猜你喜欢-->
      <GoodRelevant />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GoodRelevant from '@/views/goods/components/goods-relevant.vue'
import { useStore } from 'vuex'
// import Message from '@/components/library/Message'
import CartNone from './components/cart-none.vue'
import Confirm from '@/components/library/Confirm'
import CartSku from './components/cart-sku.vue'

export default defineComponent({
  name: 'CartPage',

  components: { GoodRelevant, CartNone, CartSku },

  props: {},

  setup () {
    const store = useStore()
    // 单选
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 删除
    const delCart = (skuId) => {
      // store.dispatch('cart/delCart', skuId).then(() => {
      //   Message({ type: 'success', text: '删除成功' })
      // })
      Confirm({ text: '亲，是否确认删除商品' }).then(() => {
        console.log('确认')
        store.dispatch('cart/delCart', skuId)
      }).catch(err => {
        console.log(err.message)
      })
    }
    // 批量删除
    const batchDeleteCart = (isClear) => {
      Confirm({ text: `亲，是否删除${isClear ? '失效' : '选中'}的商品` }).then(() => {
        console.log('确认')
        store.dispatch('cart/batchDeleteCart', isClear)
      }).catch(err => {
        console.log(err.message)
      })
    }
    // 修改商品数量修改组件
    const changeCount = (skuId, count) => {
      console.log(skuId, count)
      store.dispatch('cart/updateCart', { skuId, count: Number(count) })
    }
    // 修改商品规格
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }
    return {
      checkOne,
      checkAll,
      delCart,
      batchDeleteCart,
      changeCount,
      updateCartSku
    }
  }
})

</script>
<style lang='less' scoped>
.tc {
  text-align: center;
  .e-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .e-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.e-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,td{
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
