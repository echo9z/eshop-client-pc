// 扩展vue原有功能：全局组件，自定义指令，挂载原型方法，注意：vue3中没有全局过滤器
// library 用于处理全局注册组件，比如在一个组件中使用全局组件，就需要先导入组件，在进行使用
// vue2 插件写法：导出一个对象，有install函数，默认传入了Vue构造函数 Vue.use注册，在Vue对象之上扩展
// vue3 插件写法：导出一个对象，有install函数，默认传入了app实例 createApp(App).use注册，在app实例之上扩展
import ESkeleton from './e-skeleton' // 骨架组件
import ECarousel from './e-carousel'
import EMore from './e-more'
export default {
  install (app, options) {
    // 在app上进行扩展，app提供 component directive 函数
    // 挂载元素属性或方法 通过app.config.globalProperties 方式
    app.component(ESkeleton.name, ESkeleton) // 将骨架组件 注册为全局插件
    app.component(ECarousel.name, ECarousel)
    app.component(EMore.name, EMore)
  }
}
