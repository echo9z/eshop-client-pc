// 分类模块
import { topCategory } from '@/api/constants'
import { findCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合，依赖topCategory重新设置，保证初始化就要数据，不至于白屏
      list: topCategory.map(item => ({ name: item })) // 做个简单处理，同map返回[{name:‘美食’}]
    }
  },
  mutations: {
    // 修改分类函数 payload:所有分类的集合
    setList (state, payload) {
      state.list = payload
    },
    // 定义show 和 hide函数，控制当前二级分类的显示隐藏
    show (state, id) {
      // 找当前选择或者点击的分类，根据id 修改对应类目下的open
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = true
    },
    hide (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = false
    }
  },
  actions: {
    // 获取分类函数，发起异步请求调接口
    async getList (ctx) {
      // 获取分类数据
      const data = await findCategory()

      // 给每个分类添加上控制二级分类显示隐藏的数据
      data.result.forEach(top => {
        top.open = false // 给每个一级分类添加一个控制 二级分类显示和隐藏数据，默认隐藏
      })
      console.log(data)
      // 修改数据
      ctx.commit('setList', data.result)
    }
  }
}
