// 扩展vue原有功能：全局组件，自定义指令，挂载原型方法，注意：vue3中没有全局过滤器
// library 用于处理全局注册组件，比如在一个组件中使用全局组件，就需要先导入组件，在进行使用
// vue2 插件写法：导出一个对象，有install函数，默认传入了Vue构造函数 Vue.use注册，在Vue对象之上扩展
// vue3 插件写法：导出一个对象，有install函数，默认传入了app实例 createApp(App).use注册，在app实例之上扩展
// import ESkeleton from './e-skeleton' // 骨架组件
// import ECarousel from './e-carousel'
// import EMore from './e-more'
// import EBread from './e-bread'
// import EBreadItem from './e-bread-item'

// 使用webpack提供 require.context()函数，用于加载某个目录下所有的 .vue后缀文件
// *  然后 context 函数会返回一个导入函数 importFn，这个函数对象下有一个属性 keys() 获取所有的文件路径
// *  通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
// *  遍历的同时进行全局注册即可

import defaultImg from '@/assets/images/200.png'
import message from './Message'
// context(目录路径，是否记住子目录，加载文件的匹配正则)
const importFn = require.context('./', false, /\.vue$/)
// console.log(importFn.keys()) // 返回当前目录下所有文件路径的数组

export default {
  install (app, options) {
    // 在app上进行扩展，app提供 component directive 函数
    // 挂载元素属性或方法 通过app.config.globalProperties 方式
    // app.component(ESkeleton.name, ESkeleton) // 将骨架组件 注册为全局插件
    // app.component(ECarousel.name, ECarousel) // 通用轮播图组件
    // app.component(EMore.name, EMore) // 查看更多组件
    // app.component(EBread.name, EBread) // 面包屑组件
    // app.component(EBreadItem.name, EBreadItem) // 面包屑组件item
    // 根据importFn.keys() 进行批量注册
    importFn.keys().forEach(path => {
      // 导入组件 default 是每一个组件中export default
      const component = importFn(path).default
      // 注册组件
      app.component(component.name, component)
    })

    // 定义图片懒加载指令
    defineDirective(app)

    // 在vue上挂载原型函数
    app.config.globalProperties.$message = message
  }
}

// 1.图片懒加载指令 v-lazy
const defineDirective = (app) => {
  app.directive('lazy', {
    // 原理：img图片的地址不能存在src上，当图片进入可视区域，将存储图片地址设置给图片元素即可
    // vue2.0监听使用指令的DOM是否创建好，钩子函数：inserted (el, binding) {}
    // vue3.0的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    // 及他自己的所有子节点都挂载完成后调用，dom渲染完毕后执行
    mounted (el, binding) {
      // console.log(el)
      // 2.创建一个观察对象
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 图片加载失败的处理,error 图片加载失败的事件 load图片加载成功的事件
            el.onerror = () => {
              // 设置默认图片
              el.src = defaultImg
            }
            // 3.将指令的值赋值给 观察img的src属性
            el.src = binding.value
            // 取消当前dom观察
            observer.unobserve(el)
          }
        })
      }, { threshold: 0 }) // 相交比例为0 触发回调函
      // 对赋予v-lazy指令的el dom进行观察
      observer.observe(el)
      // console.log(binding)
    }
  })
}

/* const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target // 观察到的dom元素
      console.log(img)
      const dataSrc = img.getAttribute('data-src')
      img.setAttribute('src', dataSrc)
      // 赋值为src属性，取消当前dom观察
      observer.unobserve(img)
    }
  })
}, { threshold: 0 }) // 相交比例为0 触发回调函数 */
