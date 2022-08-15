import { createVNode, render } from 'vue'
import EConfirm from './e-confirm.vue'

// 准备一个容器
const div = document.createElement('div')
div.setAttribute('class', 'confirm-container')
document.body.appendChild(div)

// 返回对象promise对象，点取消销毁组件
export default ({ title, text }) => {
  // 调用createVNode 创建组件
  return new Promise((resolve, reject) => {
    // 传入两个处理函数，一个是取消回调，另一个是确认回调
    const cancelCallback = () => {
      // 销毁组件
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      // 销毁组件
      render(null, div)
      resolve()
    }
    const vnode = createVNode(EConfirm, { title, text, cancelCallback, submitCallback })
    render(vnode, div)
  })
}
