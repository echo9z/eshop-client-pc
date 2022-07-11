<!--
* @description 商品SKU组件，商品规格 提醒sku商品id1369155859933827074
* @fileName goods-sku.vue
* @author echo9z
* @date 2022/07/08 21:33:49
!-->
<template>
  <div class="goods-sku">
    <!-- 遍历商品 -->
    <dl v-for="item in goods.specs" :key="item.id">
      <!-- 商品的颜色，比如商品有两种样式 -->
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="spec in item.values" :key="spec.name">
          <!-- selected选中样式，disabled没货禁用样式 -->
          <img :class="{selected: spec.selected, disabled: spec.disabled}"
            @click="clickSpecs(item, spec)"
            v-if="spec.picture"
            :src="spec.picture"
            :title="spec.name"
          >
          <span v-else
            :class="{selected: spec.selected, disabled: spec.disabled}"
            @click="clickSpecs(item, spec)"
          >{{spec.name}}</span>
        </template>
      </dd>
    </dl>
    <!-- <dl>
      商品的尺寸
      <dt>尺寸</dt>
      <dd>
        <span class="disabled">10英寸</span>
        <span class="selected">20英寸</span>
        <span>30英寸</span>
      </dd>
    </dl>
    <dl>
      商品的版本
      <dt>版本</dt>
      <dd>
        <span>美版</span>
        <span>港版</span>
      </dd>
    </dl> -->
  </div>
</template>

<script>
import bwPowerSet from '@/vender/bwPowerSet'
import { defineComponent } from 'vue'

// 得到一个路径字典对象，先是将SKU集合中有库存的商品返回一个集合，在将有效商品集合得到通过幂集算法得到幂集集合
// 得到的幂集集合，转换为路径字典
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合 props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效sku使用 powerset算法得到子集
  // 4. 根据子集生成路径字典对象，对象中存储key-value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // console.log(sku)
      // 计算当前有库存的sku的子集
      // 例如：[1,2,3] ==> 得到 [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // const powerSet = bwPowerSet(sku)
      // 将sku下规格specs对象数据取出进行遍历，通过map函数进行遍历返回新的数组对象
      /**
       *  0: {name: '颜色', valueName: '蓝色'}
          1: {name: '尺寸', valueName: '10cm'}
          2: {name: '产地', valueName: '中国'}
          map函数得到['蓝色','10cm','中国']
       */
      const spec = sku.specs.map(val => val.valueName)
      // console.log(spec)
      // 再通过bwPowerSet封装幂集算法 精髓
      const specSet = bwPowerSet(spec)
      // console.log(specSet)
      // 遍历幂集，往pathMap添加数据
      specSet.forEach(set => {
        // console.log(set.join('-'))
        const key = set.join('-')
        // 向字典中添加数据
        if (pathMap[key]) { // 有相同的key
          const index = pathMap[key].findIndex(skuId => skuId === sku.id)
          if (index === -1) {
            pathMap[key].push(sku.id)
          }
        } else { // 没有key 直接赋值key
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap // 返回数据对象
}

/** 获取用户选中规格按钮
 * props.goods.specs 规格对象
 */
const getSelectArr = (specs) => {
  const selectedArr = []
  // 先筛选出选中的项比如：一共有三个规格 颜色，尺寸，产地，选中了黑色，其他两未选中为 undefined
  // ['黑色', undefined, undefined]
  // 已选中的规格，忽略判断禁用状态，比如黑色按钮选中组成的key 忽略逻辑禁用判断，让同级的 蓝色，进行逻辑判断
  // 如果未选中，那个按钮的值按顺序套入，得到套入的数组，过滤没有值得选项，插入拼接 - 得到字符串key，通过key在路径字典中查找，没有则添加禁用
  specs.forEach(specItem => {
    // 查找选中按钮对象
    const selected = specItem.values.find(val => val.selected)
    // 如果查询到了 添加名称，没有查询到 则为 undefined
    selectedArr.push(selected ? selected.name : undefined)
  })
  console.log(selectedArr)
  return selectedArr
}

// 更新按钮点击时是否有库存，没有库存按钮处于禁用状态
// 商品初始化的时候会调用，点击按钮会调用
/**
 * specs：规格数据，规格对象中添加 disabled选中属性
 * pathMap：SKU数据字典
 */
const updateDisableStatus = (specs, pathMap) => {
  // 1.每一个按钮的状态由本身添加的disabled属性来控制
  specs.forEach((spec, index) => { // 遍历每一行规格 颜色有一行规格黑色、蓝色；尺寸是一行规格20cm、30cm
    const selectArr = getSelectArr(specs) // 比如 选择筛选出的按钮 ['黑色', undefined, undefined]
    spec.values.forEach(val => { // 每个按钮 比如 黑色、20cm
      // 2.如果选中的规格按钮的名称，等于遍历每项的规格的名称，直接返回，不需要做判断
      if (val.name === selectArr[index]) return false
      // 3.替换未选中的规格按钮，比如：选中是 ['黑色', undefined, undefined] 黑色，但是黑色被选中，上面代码直接放回，替换蓝色去判断是否在路径字典中出行['蓝色', undefined, undefined]
      selectArr[index] = val.name
      // 将用户选择的selectArr数组，将undefined元素过滤掉，剩下的元素，通过 - 进行字符串拼接
      const key = selectArr.filter(select => select).join('-')
      // console.log(key)
      val.disabled = !pathMap[key] // 根据 name去路径字典查找，比如 pathMap['黑色']，存在取非，得到false，没有找到true添加禁用
    })
  })
}

// 默认选择，根据skuId，进行商品的默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.找出sku信息
  // 2.遍历每个按钮，按钮的值 和 sku对象中space 信息相同，则选中
  const sku = goods.skus.find(sku => sku.id === skuId)

  goods.specs.forEach((spec, i) => {
    // 如果规格名字 颜色 与 sku中名字 颜色，则进行查找
    if (spec.name === sku.specs[i].name) {
      const selectRes = spec.values.find(val => val.name === sku.specs[i].valueName)
      selectRes ? selectRes.selected = true : selectRes.selected = false
    }
  })
}
export default defineComponent({
  name: 'GoodsSku',

  components: {},

  props: {
    // 商品详情对象
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    // 根据传入的skuId，选中商品的按钮
    initDefaultSelected(props.goods, props.skuId)

    const pathMap = getPathMap(props.goods.skus)
    console.log(pathMap)
    // 组件初始化：商品显示的更新按钮的禁用状态
    updateDisableStatus(props.goods.specs, pathMap)

    // 选中与取消选中
    const clickSpecs = (item, spec) => {
      // 如果按钮时disable=true禁用状态阻止程序允许
      if (spec.disabled) return false
      if (spec.selected) { // 选中，取消选中
        spec.selected = false
      } else { // 第一次选择，当前规格item中没有selected，走else逻辑
        // 先将所有的规格spec项的添加一个selected，同时将所有spec项selected属性为false
        item.values.forEach(specItem => {
          specItem.selected = false
        })
        // 再将单独一项，点击改为true
        spec.selected = true
      }
      // 点击按钮时：更新按钮的禁用状态
      updateDisableStatus(props.goods.specs, pathMap)

      // 将选择的sku信息，传递给父组件，比如价格 原商品价格，库存，规格组合文本内容
      // 1. 选择完整的sku组合按钮，可以获取信息，提交到父组件
      // 2. 不是完成的sku组合按钮，提交空对象组件
      // 选中的规格数组长度 过滤掉undefined数组长度 等于 goods.specs的长度
      const validSelectedValues = getSelectArr(props.goods.specs).filter(v => v) // 选中完整的按钮 ['黑色', '20cm', '中国']
      if (validSelectedValues.length === props.goods.specs.length) {
        console.log(validSelectedValues.join('-'))
        // 在路径字典中进行查找
        const skuIds = pathMap[validSelectedValues.join('-')]
        // 根据查找到 商品的skuId，去goods.sku中查找sku信息对象
        const skuObj = props.goods.skus.find(sku => sku.id === skuIds[0])
        console.log('选择完成SkuId', skuIds)
        // 通知父组件，传入skuObj 对象
        emit('change', {
          skuId: skuObj.id,
          price: skuObj.price,
          oldPrice: skuIds.oldPrice,
          inventory: skuObj.inventory,
          // 颜色：黑色 尺码：150cm 产地：中国
          specsText: skuObj.specs.reduce((str, spec) => `${str} ${spec.name}:${spec.valueName}`, '').trim() //  颜色:黑色 尺寸:10cm 产地:中国
        })
        // console.log(skuObj.specs.reduce((str, spec) => `${str} ${spec.name}:${spec.valueName}`, ''))
      } else {
        console.log('选择不完成')
        // 父组件需要判断规格是否完整，完整不能加入购物车
        emit('change', {})
      }
    }

    return {
      clickSpecs
    }
  }
})

</script>
<style lang='less' scoped>
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected { // 选中边框线
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed; // 线条为虚线
    cursor: not-allowed; // 禁止点击
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      line-height: 40px;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
