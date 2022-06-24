// 提供复用逻辑函数（钩子）
// 数据懒加载
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 * 组件数据的懒加载，当组件出现在浏览器的可视区域，执行相关逻辑
 * 目的是监听某个对象进入可视区，调用对应api，拿到数据返回数据
 * @param {Element} target ref包裹的 DOM对象
 * @param {Function} callback 用于发送请求函数对象 API函数
 */
export const useLazyData = (target, callback) => {
  const data = ref([]) // 存放请求数据返回的对象
  // target监听的dom元素
  const { stop } = useIntersectionObserver(target, async ([{ isIntersecting }], observerElement) => {
    // console.log(isIntersecting) // isIntersecting dom元素是否进入可视区
    // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver
    // console.log(observerElement) // 被观察元素，类型为 IntersectionObserver
    if (isIntersecting) {
      stop() // dom元素进入可视区域，停止观察target DOM元素
      // 调用API函数获取数据
      if (callback) { // 如果api请求的函数存在
        const res = await callback()
        // console.log(res.result)
        data.value = res.result
      }
    }
  })
  return data
  // stop()
}
