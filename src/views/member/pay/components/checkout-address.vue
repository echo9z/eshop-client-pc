<!--
* @description 收货地址组件
* @fileName checkout-address.vue
* @author echo9z
* @date 2022/08/15 18:20:00
!-->
<template>
  <div class="checkout-address">
    <div class="text">
      <!-- showAddress没有数据显示 添加收货 -->
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-else >
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <!-- /^(\d{3})\d{4}(\d{4})/, '$1****$2' 意思$1替换第一段3位 中间*号替换4位  -->
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation}} {{showAddress.address}}</li>
      </ul>
      <!-- 修改地址是，将showAddress显示的地址传入 -->
      <a v-if="showAddress" @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <EButton @click="changeAddress()" class="btn">切换地址</EButton>
      <EButton @click="openAddressEdit({})" class="btn">添加地址</EButton>
    </div>
  </div>
  <!-- 收货地址的切换 - 地址对话框 -->
  <EDialog class="address" title="收货地址" v-model:visible="visibleDialog" >
    <template v-slot:default>
      <div class="text item" v-for="item in list" :key="item.id"
        @click="selectAddress = item"
        :class="{active: selectAddress && selectAddress.id === item.id}"
      >
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <!-- 将空格替换为没有字符 -->
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
    </template>
    <template #footer>
      <EButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</EButton>
      <EButton @click="confirmAddress" type="primary">确认</EButton>
    </template>
  </EDialog>

  <!-- 收货地址组件 - 添加/修改对话框 -->
  <AddressEdit @onSuccess="successHandler($event)" ref="addressEditCom" />
</template>

<script>
import Message from '@/components/library/Message'
import { defineComponent, ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default defineComponent({
  name: 'CheckoutAddress',

  components: { AddressEdit },

  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },
  // 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
  // 如果你在组件渲染是代码片段，vue3规范，需要在emits中声明所触发的自定义事件
  // 提倡：触发了哪些自定义事件，需要在emits中进行声明
  emits: ['change'],
  setup (props, { emit }) {
    // 1.找到收货地址
    // 2.没有默认收货地址，使用第一条收货地址
    // 3.没有受过地址，显示提示请求添加后货地址
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0) // 获取数据isDefault为0，默认的收货地址
    if (defaultAddress) { // 如果默认收货地址存在
      showAddress.value = defaultAddress
    } else { // 没有默认的收货地址，则取出第一条数据
      // props.value.list 收货地址数组长度有数据，则默认取出第一条数据
      showAddress.value = props.list.length && props.list[0]
    }
    const visibleDialog = ref(false)

    // 初始化时，将默认收地址的id 传入给父组件checkout
    // showAddress.value && showAddress.value.id 简写为es6语法 showAddress.value?.id
    emit('change', showAddress.value && showAddress.value.id) // 短路 showAddress有值，则执行后面的 id

    // 记录选中地址的id
    const selectAddress = ref(null)

    // 确认切换收货地址
    const confirmAddress = () => {
      if (!props.list.length) return Message({ type: 'warn', text: '请添加收货地址！' })
      if (!selectAddress.value) return Message({ type: 'warn', text: '请选择收货地址！' })
      // 显示在地址切换为 选中的地址
      showAddress.value = selectAddress.value
      // 把选中的地址id，传递给父组件checkout
      emit('change', selectAddress.value.id)
      // 关闭dialog对话框
      visibleDialog.value = false
    }

    // 点击切换地址按钮，显示dialog对话框
    const changeAddress = () => {
      // 显示对话框
      visibleDialog.value = true
      if (defaultAddress) {
        // 如果存在 选中的地址 为默认的地址
        selectAddress.value = defaultAddress
      } else {
        // 在给selectAddress 赋值前，清空selectAddress数据
        selectAddress.value = null
      }
    }

    const addressEditCom = ref(null)
    // 调用address-edit实例中的方法，调组件内部方法，打开编辑收货地址对话框
    const openAddressEdit = (address) => {
      console.log(address)
      // 添加时候是{} 修改时是一个showAddress对象
      addressEditCom.value.open(address)
    }

    const successHandler = (formData) => {
      // 根据传入的formData 收货地址数据id，去 list中的元素id进行查找，有则是修改，无则是添加
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        for (const key in address) {
          // 引用地址
          address[key] = formData[key]
        }
      } else {
        // 往list 数据列表中添加一条数据
        // 当你修改formData的时候，数据中的数据也会更新，原因是用一个引用地址
        // 当打AddressEdit对话框，取消清空之前的输入信息
        // 克隆formData对象
        const formDataStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(formDataStr))
        if (!showAddress.value) { // 如果没有收货地址
          showAddress.value = formData
          emit('change', showAddress.value && showAddress.value.id)
        }
      }
    }
    return {
      showAddress,
      visibleDialog,
      changeAddress,
      selectAddress,
      confirmAddress,
      openAddressEdit,
      addressEditCom,
      successHandler
    }
  }
})

</script>
<style lang='less' scoped>
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.e-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover { // 鼠标进过，或者 选中
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.address{
  :deep(.body) {
    height: 560px; // 给个固定的高度，通过overflow：auto添加浏览器自定义下拉框
    overflow: auto;
  }
}
</style>
