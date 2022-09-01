<!--
* @description steps步骤组件item
* @fileName e-steps-item.vue
* @author echo9z
* @date 2022/08/31 16:36:04
!-->
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EStepsItem',

  components: {},

  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
</style>
