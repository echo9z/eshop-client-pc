// 提供复用逻辑函数（钩子）
// 数据懒加载
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'
import dayjs from 'dayjs'
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
        console.log(res.result)
        data.value = res.result
      }
    }
  }, { threshold: 0 }) // 观察的target dom元素与浏览器可视区的比例大于0就触发 上面的箭头函数
  return data
}
/**
 * 倒计时逻辑
 * @param {Integer} countdown - 倒计时的秒数
 */
export const usePayTime = () => {
  // 使用 useIntervalFn处理短信倒计时逻辑
  const time = ref(0) // 一个默认的到计时的时间，一般都是通过后台获取的事件
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    // 倒计时处理的逻辑
    time.value--
    console.log(time.value)
    // 通过unix函数 安装格式转换为format
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) { // 小于等于0，停止定时器
      pause()
    }
  }, 1000, { immediate: false }) // immediate立即开启定时器)

  const start = (countdown) => {
    time.value = countdown
    // 这里timeText 为了，在页面加载的时候，直接显示处理好的根式内容，不需要在等待1秒
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  const end = () => {
    pause()
  }

  return {
    start,
    end,
    timeText,
    time
  }
}
