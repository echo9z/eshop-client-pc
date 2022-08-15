import { findCart, getNewCartGoods, mergeCart, insertCart, delCart, updateCart, checkAllCart } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(goods => {
        return goods.stock > 0 && goods.isEffective
      })
    },
    /**
     * 有效商品总件数
     * @param {*} state 当前模块的state
     * @param {*} getters 当前模块的局部 getters
     */
    validTotal (state, getters) {
      return getters.validList.reduce((count, goods) => count + goods.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((count, goods) => count + (1000 * goods.nowPrice * goods.count), 0) / 1000
    },
    // 无效商品列表
    invalidList (state) {
      // 商品库存数量等于0，或者 商品无效
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      // 商品选择属性为 true
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.length
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((count, goods) => Math.round(count + (1000 * goods.nowPrice * goods.count)), 0) / 1000
    },
    // 是否全选
    isCheckAll (state, getters) {
      // 已选中商品数量 等等于 有效商品，同时有效商品数量不为0
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    insertCart (state, payload) {
      // 约定的加入购物车字段，与后端添加购物车字段一致 payload对象字段
      // id skuId name picture attrsText price nowPrice selected stock count isEffective
      // 1.插入商品规则，是否有相同的商品
      // 2.如果有相同的商品，先查询商品的数量，在累加到payload上在，将原来的商品元素删除，unshift在数组第一元素插入
      // 3.如果没有相同商品，保存在最新的位置（数组第一元素）
      const goodsIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      console.log(goodsIndex)
      if (goodsIndex > -1) { // 添加的商品存在于list数组中
        const count = state.list[goodsIndex].count // 将购物车商品的数量取出
        payload.count += parseInt(count)
        // 删除原有的商品
        state.list.splice(goodsIndex, 1)
      }
      // 在list 第一个元素追加商品
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息数组，每个元素对象包含 nowPrice现价，stock库存，isEffective商品是否有效
      // goods 商品对象的自动不固定，对象中有哪些字段就该哪些字段，字段值合法，修改state中list数据
      // goods 商品对象，必须有skuId
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      // 根据goods 对象中的字段进行修改对应字段数据
      for (const key in goods) {
        if (goods[key] !== '' && goods[key] !== undefined && goods[key] !== null) {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除商品 根据skuId删除构成物车商品
    delCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 修改规格数据
    updateCartSku (state, { oldSkuId, newGoods }) {
      const updateGoods = state.list.find(item => item.skuId === oldSkuId)
      console.log(updateGoods, newGoods)
      // 根据goods 对象中的字段进行修改对应字段数据
      for (const key in newGoods) {
        if (newGoods[key] !== '' && newGoods[key] !== undefined && newGoods[key] !== null) {
          updateGoods[key] = newGoods[key]
        }
      }
      console.log(updateGoods)
    },
    // 设置购物车数据，设置购物车数据为空
    setCart (state, payload) {
      // 为空数组清空购物车，有值设置购物车
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart ({ state, commit }) {
      const cartList = state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      const res = await mergeCart(cartList)
      console.log(res)
      if (res.msg === '操作成功') commit('setCart', [])
    },
    // 加入购物车
    /**
     * ctx 上下文对象
      {
        state,      // 等同于 `store.state`，若在模块中则为局部状态
        rootState,  // 等同于 `store.state`，只存在于所有模块中
        commit,     // 等同于 `store.commit`
        dispatch,   // 等同于 `store.dispatch`
        getters,    // 等同于 `store.getters`
        rootGetters // 等同于 `store.getters`，只存在于模块中
      }
     */
    insertCart ({ state, rootState, commit }, payload) {
      return new Promise((resolve, reject) => {
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          console.log(1)
          insertCart({ skuId: payload.skuId, count: payload.count }).then(res => {
            commit('insertCart', res.result)
            resolve()
          })
        } else { // 未登录
          console.log(payload)
          commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 当用户的进入系统是，根据本地购物商品的skuId进行后台请求查询，购车商品是否有效
    // 页面初始化和组件初始化时，更新商品信息
    findCart ({ state, rootState, commit }) { // 获取商品列表
      return new Promise((resolve, reject) => {
        // 区分是已登录 或者 未登录
        // 未登录时根据本地购物商品数据进行修改，已登录是直接获取后台的购物车数据
        if (rootState.user.profile.token) {
          findCart().then(data => {
            // console.log(data)
            commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 购物车中有多个商品，比如5个，同时是发送skuId请求去查询，商品是否有效，视图的更新需要等第5个请求结果返回，在进行视图渲染
          // Promise.all(promise数组).then(dataList => {}) 同时发送多个请求，返回响应成功数据对象数组
          const promiseAll = state.list.map(goods => { // 通过map函数，循环发送请求，map函数最后得到是一个promise数组
            return getNewCartGoods(goods.skuId)
          })
          // 通过Promise.all得到所有的请求结果goods数组
          // 返回得到的数组索引顺序，与map中循环遍历state中list的顺序一致
          Promise.all(promiseAll).then(goods => {
            console.log(goods)
            goods.forEach((item, index) => {
              // 更新本地购物车
              commit('updateCart', { skuId: state.list[index].skuId, ...item.result }) // 将请求的数据返回进行解构
              // 调用resolve 代表执行成功
              resolve()
            })
          })
        }
      })
    },
    // 删除购物车商品
    delCart ({ rootState, commit }, payload) {
      // 单条删除 payload 现在就是 skuId
      return new Promise((resolve, reject) => {
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          // TODO: 已登录
          delCart({ ids: [payload] }).then(res => {
            console.log(res)
            if (res.msg === '操作成功') {
              // 删除本地购车商品
              commit('delCart', payload)
              resolve()
            }
          })
          console.log(1)
        } else { // 未登录
          console.log('删除操作', payload)
          commit('delCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车 比如：商品选中状态，和数量
    updateCart ({ rootState, commit }, payload) {
      // payload数据对象中，必须包含skuId，可能有selected，count
      return new Promise((resolve, reject) => {
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          console.log(1)
          updateCart(payload).then(res => {
            if (res.msg === '操作成功') commit('updateCart', payload)
          })
          resolve()
        } else { // 未登录
          console.log('操作', payload)
          commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 有效商品全选 和 全不选
    checkAllCart ({ rootState, getters, commit }, selected) {
      return new Promise((resolve, reject) => {
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          // TODO: 已登录
          console.log(1)
          // 过滤有效商品的skuId
          const ids = getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(res => {
            if (res.msg === '操作成功') {
              ids.forEach(skuId => {
                commit('updateCart', { skuId, selected })
              })
            }
          })
        } else { // 未登录
          getters.validList.forEach(goods => {
            commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart ({ rootState, getters, commit }, isClear) {
      return new Promise((resolve, reject) => {
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          console.log(1)
          // 通过 清空无效效商品 和 已选中商品商品
          const ids = getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          delCart({ ids }).then(res => {
            if (res.msg === '操作成功') {
              getters[isClear ? 'invalidList' : 'selectedList'].forEach(goods => {
                // 找出选中的商品列表，遍历调用mutation方法删除
                commit('delCart', goods.skuId)
              })
            }
          })
        } else { // 未登录
          if (getters[isClear ? 'invalidList' : 'selectedList'].length > 0) {
            // 传入的isClear 为true 是清空失效商品，否则为清空选中商品
            getters[isClear ? 'invalidList' : 'selectedList'].forEach(goods => {
              // 找出选中的商品列表，遍历调用mutation方法删除
              commit('delCart', goods.skuId)
            })
          }
          resolve()
        }
      })
    },
    // 根据sku信息修改购物车商品信息
    updateCartSku ({ rootState, state, getters, commit }, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        const oldGoods = state.list.find(goods => goods.skuId === oldSkuId)
        const { skuId, oldPrice, price: nowPrice, specsText: attrsText, inventory: stock } = newSku.value
        // 区分已登录 和 未登录
        if (rootState.user.profile.token) {
          // const oldGoods = state.list.find(goods => goods.skuId === oldSkuId)
          // 更新服务端商品规格信息，服务端没有提供修改商品SKU参数，需要根据旧skuId删除原来的商品，在插入一个新的数据
          delCart({ ids: [oldGoods.skuId] }).then(() => {
            return insertCart({ skuId: newSku.value.skuId, count: oldGoods.count })
          }).then(() => {
            const newGoods = { skuId, nowPrice, oldPrice, attrsText, stock }
            commit('updateCartSku', { oldSkuId, newGoods })
            resolve()
          })
          console.log(1)
        } else { // 未登录
          // 找出旧的商品信息
          // 删除旧的商品数据
          // 根据新的sku信息 和 旧的商品信息，合并成为一条新的商品信息
          // 在原来的位置 添加新的商品信息
          // const oldGoods = state.list.find(goods => goods.skuId === oldSkuId)
          // commit('delCart', oldSkuId)
          console.log(oldSkuId, newSku.value)
          // const { skuId, oldPrice, price: nowPrice, specsText: attrsText, inventory: stock } = newSku.value
          // 合并对象
          const newGoods = { ...oldGoods, skuId, nowPrice, oldPrice, attrsText, stock }
          commit('updateCartSku', { oldSkuId, newGoods })
          resolve()
        }
      })
    }
  }
}
