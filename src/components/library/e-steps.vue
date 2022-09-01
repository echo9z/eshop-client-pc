<!--
* @description 进度条组件
* @fileName e-steps.vue
* @author echo9z
* @date 2022/08/31 15:30:46
!-->
<!-- <template>
  <div class="e-steps">
    <div class="e-steps-item" :class="{active:i<3}" v-for="i in 5" :key="i">
      第几步，span标签左右存在伪元素
      <div class="step"><span>{{i}}</span></div>
      <div class="title">提交订单</div>
      <div class="desc">2021-03-18 02:11:47</div>
    </div>
  </div>
</template>
使用render函数进行渲染-->

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ESteps',
  props: {
    // 默认激活第一项
    active: {
      type: Number,
      default: 1
    }
  },
  render () {
    // 获取到默认插槽的节点
    const stepItem = this.$slots.default()
    // 获取所有动态的生成EStepsItem节点
    const dynamicSteps = []
    stepItem.forEach(item => {
      if (item.type.name === 'EStepsItem') {
        dynamicSteps.push(item)
      } else if (item.children instanceof Array) {
        item.children.forEach(step => {
          dynamicSteps.push(step)
        })
      }
    })
    // 根据动态节点生成 item 的jsx对象在
    const jsx = dynamicSteps.map((item, i) => {
      return <div class="e-steps-item" class={{ active: i < this.active }} >
      <div class="step"><span>{i + 1}</span></div>
      <div class="title">{item.props.title}</div>
      <div class="desc">{item.props.desc}</div>
    </div>
    })

    return <div class="e-steps">{jsx}</div>
  },

  components: {},

  setup () {
    return {
    }
  }
})

</script>
<style lang='less' scoped>
.e-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
