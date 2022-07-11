<!--
* @description 城市组件 选中省市
* @fileName e-city.vue
* @author echo9z
* @date 2022/07/07 18:38:32
!-->
<template>
  <div class="e-city" ref="target">
    <div class="select" :class="{active:visible}" @click="toggle">
      <!-- fullLocation没有数据，显示收货地址按钮 -->
      <span v-if="!fullLocation" class="placeholder" >请选择配送地址</span> <!-- 选择的收货地址 -->
      <span v-else class="value">{{fullLocation}}</span> <!-- 选择后的值 -->
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 点击地址，显示的下拉按钮 -->
    <div class="option" v-if="visible">
      <!-- 这里的loading是通过样式设置的背景图片，但是存在一个问题，当显示下拉按钮会同时请求背景图片 和 发起获取城市json数据的请求，可能就是出现loading图片不显示效果
      比如发起获取城市json数据返回了，请求的背景图片没有返回，将图片处理完base64格式图片，即打包成字符串 -->
      <div v-if="loading" :class="{loading:loading}" ></div>
      <template v-else >
        <span class="ellipsis" v-for="item in currentList" :key="item.code"
          @click="selectCity(item)">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
// 获取省市区数据函数
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 当本地没有缓存，发起请求获取数据
// 当本地有缓存，去除本地数据
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
// 返回一个Promise对象，在then中获取数据，这里可能是异步操作可能是同步操作
const getCityData = () => {
  // 约定：缓存变量的数据存储在 window.cityData属性中
  return new Promise((resolve, reject) => {
    if (window.cityData) { // 变量数据缓存内存中，有数据，直接resolve
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // console.log(res)
        // 使用变量 进行内存缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
export default defineComponent({
  name: 'ECity',

  components: {},

  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  /*  mounted () {
    document.addEventListener('click', (e) => {
      console.log(e.target.className)
      if (e.target.className !== 'select' && e.target.className !== 'ellipsis') { // e-city
        console.log(e.target.className)
      }
    })
  }, */
  setup (props, { emit }) {
    // 控制option框的隐藏和显示
    const visible = ref(false)
    const allCityData = ref([]) // 所有城市数据
    const loading = ref(false) // 加载是显示，骨架效果
    // 打开 和 关闭函数
    const open = async () => {
      visible.value = true
      loading.value = true // 在发送
      // 用户点击时获取城市地区数据
      const data = await getCityData().finally(() => {
        loading.value = false
      })
      allCityData.value = data

      // 在每次点击时，清空之前的选中数据，计算属性就会将window.cityData数据赋值给
      for (const key in selectResult) {
        selectResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 实现点击组件外部元素，进行关闭操作框
    const target = ref(null)
    // 参数1：监听那个元素
    // 参数2：点击监听外元素的外部，触发回调函数
    onClickOutside(target, (event) => close())

    // 通过计算属性，显示当前地区列表数据，比如点击一开始 option展示的数据是34省，当点击北京，将原来的allCityData全部替换为北京市下的区；如果点区比如平昌区，allCityData全部替换为区下的街道
    const currentList = computed(() => {
      // 第一次点击，默认显示省一级的
      let list = allCityData.value
      // 市一级，如何是市一级，如果 selectResult中provinceCode数据发送变化，说明已经点击了某个省，
      // 比如浙江省点击下面 selectCity函数记录省的 code
      if (selectResult.provinceCode) {
        console.log(selectResult.provinceName)
        // 根据provinceCode 遍历查找省的 对象，对象下的areaList是 市一级对象数据
        list = list.find(province => province.code === selectResult.provinceCode).areaList// 返回某一个市级的数据
      }
      // 第二次点击，显示杭州市，市下面有areaList 地区
      if (selectResult.cityCode) {
        console.log(selectResult.cityName)
        // 根据cityCode 遍历查找 市的 对象，对象下的areaList是 地区的对象数据
        list = list.find(city => city.code === selectResult.cityCode).areaList// 返回某一个地区的数据
      }
      return list
    })

    // 定义选定 的 省市区的 数据
    const selectResult = reactive({
      provinceCode: '', // 省code
      provinceName: '', // 省名称
      cityCode: '', // 城市code
      cityName: '', // 城市名称
      countyCode: '', // 区code
      countyName: '', // 区名称
      fullLocation: '' // 拼接完成的收货地址
    })
    // 当点击每个item，记录数据
    const selectCity = (item) => {
      if (item.level === 0) { // 省级
        selectResult.provinceCode = item.code
        selectResult.provinceName = item.name
      }
      if (item.level === 1) { // 市级
        selectResult.cityCode = item.code
        selectResult.cityName = item.name
      }
      if (item.level === 2) { // 地区
        selectResult.countyCode = item.code
        selectResult.countyName = item.name
        // 逻辑走到if中，用户选择了最后一级 地区
        // 选中的地区 即最后一级，关闭选择框
        close() // 关闭选择框
        // 将选择的数据 给到 fullLocation
        selectResult.fullLocation = `${selectResult.provinceName} ${selectResult.cityName} ${selectResult.countyName}`
        // 通知父组件，修改父组件的参数
        emit('change', selectResult)
        // selectResult.provinceCode = ''
        // selectResult.cityCode = ''
      }
    }
    return {
      visible,
      open,
      close,
      toggle,
      target,
      loading,
      currentList,
      selectCity
    }
  }
})

</script>
<style lang='less' scoped>
.e-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading { // 34个选择按钮的，loading效果
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
