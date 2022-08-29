<!--
* @description tab组件
* @fileName e-tabs.vue
* @author echo9z
* @date 2022/08/25 14:00:47
!-->
<script>
import { defineComponent, provide, ref, watch } from 'vue'
export default defineComponent({
  name: 'ETabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = ref(null)

    // 3.点击选项卡 触发的函数，即通过jsx语法生成的 每个a标签，点击a触发函数
    const tabClick = (item, index) => {
      activeName.value = item.props.name
      emit('update:modelValue', activeName.value) // 完成modelValue双向数据绑定的传值
      // 同时每次点击tab时，触发change事件
      emit('tab-change', { tab: item, index })
    }
    // 1.通过watch 去监听是否传入modelValue值
    watch(() => props.modelValue, newValue => {
      activeName.value = newValue
    }, { immediate: true })

    // 2.使用依赖注入，将activeName值传入给e-tab-panel组件
    provide('activeName', activeName)
    return {
      activeName,
      tabClick
    }
  },
  // 通过render动态的渲染，阻止tabPanel组件
  render () {
    // 获取插槽内容
    const tabPanel = this.$slots.default() // 默认插槽对应每一个 e-tab-panel
    // console.log(tabPanel)
    // 动态的panels组件的集合
    const dynamicPanels = []
    tabPanel.forEach(item => {
      // console.log(item.children.length)
      if (item.type.name === 'ETabPanel') {
        dynamicPanels.push(item)
      } else if (item.children instanceof Array) {
        item.children.forEach(panel => {
          dynamicPanels.push(panel)
        })
      }
    })
    // console.log(dynamicPanels)
    // 1.tabs组件大容器
    // 2.每个选项卡的导航菜单结构
    // 3.内容容器
    const nav = <nav>
      { dynamicPanels.map((item, i) => { // map返回的是一个数组
        return <a
          onClick={() => this.tabClick(item, i)}
          class={{ active: item.props.name === this.activeName }} href='javascript:;'
        >{item.props.label}</a>
      }) }
    </nav>
    return <div class="e-tabs">
      {[nav, tabPanel]}
    </div>
  },
  /* render () {
    // 1. 通过babel插件帮助下，在vue中使用jsx语法
    // 2. 数据的使用
    const name = 'hello'
    const title = 'a'
    // 3. 事件绑定
    const say = () => {
      console.log('hi jsx')
    }
    // 4. 定义一个jsx对象
    const jsx = <sub> sub </sub>
    const a = [<a>test1</a>, <a>test2</a>]
    return <h1 onClick={say} title={title} >
        这里是jsx语法 {name}
        {jsx}
        <br/>
        {a}
      </h1>
  },
  */
  components: {}
})

</script>
<style lang='less' scoped>
.e-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
