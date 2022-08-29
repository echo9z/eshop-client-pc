<!--
* @description tab选项卡
* @fileName e-tab-panel.vue
* @author echo9z
* @date 2022/08/25 15:13:47
!-->
<template>
  <div class="container" v-show="activeName === name">
    <slot />
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue'
export default defineComponent({
  name: 'ETabPanel',

  components: {},

  props: {
    label: { // tab选项卡标题
      type: String,
      default: ''
    },
    name: { // 每个tab选项卡 唯一标识
      type: [String, Number],
      default: ''
    }
    // this.$slot.default()
  },

  setup () {
    const activeName = inject('activeName')
    return {
      activeName
    }
  }
})

</script>
<style lang='less' scoped>
</style>
