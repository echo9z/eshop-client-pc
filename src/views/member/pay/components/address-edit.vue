<!--
* @description 组件机会实现添加地址 和 修改地址功能
* @fileName address-edit.vue
* @author echo9z
* @date 2022/08/17 18:38:02
!-->
<template>
  <EDialog :title="`${formData.id ? '修改':'添加'}收货地址`" v-model:visible="visibleDialog" >
    <!-- 表单 -->
    <div class="address-edit">
      <div class="e-form">
        <div class="e-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input class="input" v-model="formData.receiver" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="e-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input class="input" v-model="formData.contact" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="e-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <ECity :fullLocation="formData.fullLocation" @change="changeCity" placeholder="请选择所在地区"/>
          </div>
        </div>
        <div class="e-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input class="input" v-model="formData.address" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="e-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input class="input" v-model="formData.postalCode" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="e-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input class="input" v-model="formData.addressTags" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <template #footer>
      <EButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</EButton>
      <EButton @click="submit" type="primary">确认</EButton>
    </template>
  </EDialog>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default defineComponent({
  name: 'AddressEdit',

  components: {},

  props: {},

  setup (props, { emit }) {
    const visibleDialog = ref(false)
    // 定义open函数，作为打开对话框函数（当组件的实例拥有open函数）
    const open = (address) => {
      visibleDialog.value = true
      // 传入的数据有值则为 修改地址
      if (address.id) {
        // 填充表单
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        // 如果是添加，则清除之前添加写的地址
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = ''
          }
        }
      }
    }

    // 表单数据对象
    const formData = reactive({
      receiver: '', // 收货人姓名
      contact: '', // 联系方式
      provinceCode: '', // 所在省份编码
      cityCode: '', // 所在城市编码
      countyCode: '', // 所在区/县编码
      address: '', // 详细地址
      postalCode: '', // 邮政编码
      addressTags: '', // 地址标签,以英文逗号分割
      isDefault: 1,
      fullLocation: '' // ecity 城市组件的显示完整城市拼接
    })

    // 城市选择
    const changeCity = (selectResult) => {
      console.log(selectResult)
      const {
        provinceCode, // 省code
        cityCode, // 城市code
        countyCode, // 区code
        fullLocation // 拼接完成的收货地址
      } = selectResult
      formData.fullLocation = fullLocation
      formData.provinceCode = provinceCode
      formData.cityCode = cityCode
      formData.countyCode = countyCode
    }

    // 确认按钮 submit处理逻辑
    const submit = () => {
      // TODO: 提交前需要效验表单数据 目前省略
      // 提交添加地址请求
      console.log(formData)
      if (formData.id) {
        // 修改请求
        editAddress(formData).then(res => {
          if (res.msg === '操作成功') {
            Message({ type: 'success', text: '修改收货地址成功' })
            // 关闭对话框
            visibleDialog.value = false
            // 触发一个自定义事件
            emit('on-success', formData)
          }
        })
      } else {
        // 添加请求
        addAddress(formData).then(res => {
          if (res.msg === '操作成功') {
            Message({ type: 'success', text: '添加收货地址成功' })
            // 关闭对话框
            visibleDialog.value = false
            formData.id = res.result.id
            // 添加完毕将 添加的收货地址插入到 checkout组件中userAddresses中
            // 触发一个自定义事件
            emit('on-success', formData)
          }
        })
      }
    }
    return {
      visibleDialog,
      open,
      formData,
      changeCity,
      submit
    }
  }
})

</script>
<style lang='less' scoped>
.e-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.e-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.e-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
