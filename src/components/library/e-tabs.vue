<!--
* @description tab组件
* @fileName e-tabs.vue
* @author echo9z
* @date 2022/08/25 14:00:47
!-->
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ETabs',

  render () {
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
  components: {},

  props: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
