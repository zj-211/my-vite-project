<template>
    <div class="container mx-auto px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 左侧导航 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4">{{ $t('account.title') }}</h2>
          <ul class="space-y-2">
            <li>
              <button 
                @click="activeTab = 'profile'"
                :class="['w-full text-left px-4 py-2 rounded', activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']"
              >
                {{ $t('account.profile') }}
              </button>
            </li>
            <li>
              <button 
                @click="activeTab = 'orders'"
                :class="['w-full text-left px-4 py-2 rounded', activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']"
              >
                {{ $t('account.orders') }}
              </button>
            </li>
            <li>
              <button 
                @click="activeTab = 'address'"
                :class="['w-full text-left px-4 py-2 rounded', activeTab === 'address' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']"
              >
                {{ $t('account.Address') }}
              </button>
            </li>
            <li>
              <button 
                @click="activeTab = 'realname'"
                :class="['w-full text-left px-4 py-2 rounded', activeTab === 'realname' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50']"
              >
                {{ $t('account.verification') }}
              </button>
            </li>
          </ul>
        </div>
  
        <!-- 右侧内容区 -->
        <div class="md:col-span-3">
          <!-- 个人信息 -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-6">{{ $t('account.profile') }}</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.username') }}</label>
                <input 
                  type="text" 
                  v-model="userInfo.username" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  readonly
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.accountNumber') }}</label>
                <input 
                  type="text" 
                  v-model="userInfo.account" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  readonly
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.registerTime') }}</label>
                <input 
                  type="text" 
                  :value="userInfo.create_time" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  readonly
                >
              </div>
            </div>
          </div>
  
          <!-- 地址管理 -->
          <div v-if="activeTab === 'address'" class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">{{ $t('account.addressManagement') }}</h2>
              <button 
                @click="showAddressForm = true; editingAddress = null"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ $t('account.addNewAddress') }}
              </button>
            </div>
  
            <!-- 地址列表 -->
            <div class="space-y-4">
              <div 
                v-for="address in addresses" 
                :key="address.id" 
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ address.aname }}</p>
                    <p class="text-gray-600 mt-1">{{ address.aphone }}</p>
                    <p class="text-gray-600 mt-1">{{ address.addr }}</p>
                  </div>
                  <div class="space-x-2">
                    <button 
                      @click="editAddress(address)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {{ $t('account.edit') }}
                    </button>
                    <button 
                      @click="deleteAddressHandler(address.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      {{ $t('account.delete') }}
                    </button>
                  </div>
                </div>
                <div class="mt-2 flex items-center space-x-4">
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="!address.isdefault"
                      @change="toggleDefaultAddress(address)"
                      class="form-checkbox"
                    >
                    <span class="ml-2 text-sm text-gray-600">{{ $t('account.setAsDefault') }}</span>
                  </label>
                </div>
              </div>
            </div>
  
            <!-- 地址表单对话框 -->
            <div v-if="showAddressForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 class="text-lg font-bold mb-4">{{ editingAddress ? $t('account.editAddress') : $t('account.addNewAddress') }}</h3>
                <form @submit.prevent="saveAddress" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.recipientName') }}</label>
                    <input 
                      v-model="addressForm.aname"
                      type="text"
                      required
                      maxlength="30"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.phoneNumber') }}</label>
                    <input 
                      v-model="addressForm.aphone"
                      type="tel"
                      required
                      maxlength="11"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.detailedAddress') }}</label>
                    <textarea 
                      v-model="addressForm.addr"
                      required
                      maxlength="100"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div class="flex justify-end space-x-4">
                    <button 
                      type="button"
                      @click="showAddressForm = false"
                      class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {{ $t('account.cancel') }}
                    </button>
                    <button 
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {{ $t('account.save') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
  
          <!-- 实名认证 -->
          <div v-if="activeTab === 'realname'" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-6">{{ $t('account.verification') }}</h2>
            <form @submit.prevent="saveRealName" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.idNumber') }}</label>
                <input 
                  v-model="realNameForm.identity_card"
                  type="text"
                  required
                  maxlength="64"
                  :readonly="!!realName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.RealName') }}</label>
                <input 
                  v-model="realNameForm.realname"
                  type="text"
                  required
                  maxlength="30"
                  :readonly="!!realName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
              </div>
              <div v-if="!realName">
                <button 
                  type="submit"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {{ $t('account.submitVerification') }}
                </button>
              </div>
              <div v-else class="text-green-600">
                {{ $t('account.verificationCompleted') }}
              </div>
            </form>
          </div>
  
          <!-- 订单模块 -->
          <div v-if="activeTab === 'orders'" class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">{{ $t('account.orders') }}</h2>
            <div v-if="orders.length > 0">
              <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-sm mb-4 p-4">
                <!-- 订单头部信息 -->
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <span class="text-gray-600">{{ $t('account.orderNumber') }}: {{ order.trade_no }}</span>
                    <span class="ml-4 text-gray-600">{{ $t('account.createTime') }}: {{ order.create_time }}</span>
                  </div>
                  <span class="text-blue-600">{{ order.status }}</span>
                </div>
  
                <!-- 商品列表 -->
                <div class="space-y-4">
                  <div v-for="item in order.order_items" :key="item.id" 
                    class="flex items-center p-2 hover:bg-gray-50 rounded">
                    <img 
                      :src="getImageUrl(item.goods.main_image)" 
                      :alt="item.goods.name"
                      class="w-20 h-20 object-cover rounded"
                    >
                    <div class="ml-4 flex-grow">
                      <h3 class="text-gray-800">{{ item.goods?.name }}</h3>
                      <div class="flex justify-between items-center mt-2">
                        <span class="text-gray-600">{{ $t('account.unitPrice') }}: ¥{{ item.count }}</span>
                        <span class="text-gray-600">{{ $t('account.quantity') }}: {{ item.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- 订单底部信息 -->
                <div class="flex justify-between items-center mt-4 pt-2 border-t">
                  <div>
                    <span class="text-gray-600">{{ $t('account.paymentMethod') }}: {{ order.pay }}</span>
                    <span class="ml-4 text-gray-600">{{ $t('account.totalAmount') }}: ¥{{ order.total_amount }}</span>
                  </div>
                  <div class="space-x-2">
                    <button v-if="order.status === '待支付'" 
                      class="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      @click="handlePayOrder(order.id)">
                      {{ $t('account.pay') }}
                    </button>
                    <button v-if="order.status === '待收货'" 
                      class="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      @click="handleConfirmReceive(order.id)">
                      {{ $t('account.confirmReceive') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 加载状态 -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <el-loading :loading="loading" />
            </div>
            <!-- 暂无订单提示 -->
            <div v-else-if="!orders.length" class="text-center py-8 text-gray-500">
              {{ $t('account.noOrders') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { ElMessage } from 'element-plus'
  import { ElLoading } from 'element-plus'
  import { 
    getAddressList, 
    addAddress, 
    updateAddress, 
    deleteAddress,
    getRealNameInfo,
    submitRealName
  } from '@/api/user'
  import { getOrderList, confirmReceive, payOrder } from '@/api/order'
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  const userStore = useUserStore()
  const activeTab = ref('profile')
  const addresses = ref([])
  const realName = ref(null)
  const showAddressForm = ref(false)
  const editingAddress = ref(null)
  const orders = ref([])
  const loading = ref(false)
  
  // 用户信息
  const userInfo = ref({
    username: userStore.username,
    account: userStore.account,
    create_time: userStore.create_time
  })
  
  // 地址表单
  const addressForm = ref({
    aname: '',
    aphone: '',
    addr: '',
    isdefault: false
  })
  
  // 实名认证表单
  const realNameForm = ref({
    identity_card: '',
    realname: ''
  })
  
  // 获取地址列表
  const fetchAddresses = async () => {
    try {
      const response = await getAddressList()
      if (response.data.status === 'success') {
        addresses.value = response.data.addresses
      } else {
        throw new Error(response.data.message || '获取地址列表失败')
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
      ElMessage.error('获取地址列表失败')
    }
  }
  
  // 获取实名认证信息
  const fetchRealName = async () => {
    try {
      const response = await getRealNameInfo()
      if (response.data.status === 'success') {
        realName.value = response.data.realname
        if (realName.value) {
          realNameForm.value = { ...realName.value }
        }
      }
    } catch (error) {
      console.error('获取实名认证信息失败:', error)
    }
  }
  
  // 获取订单列表
  const fetchOrders = async () => {
    loading.value = true
    try {
      const res = await getOrderList()
      console.log('订单响应数据:', res)
      if (res.data.status === 'success' && Array.isArray(res.data.orders)) {
        orders.value = res.data.orders
        // 添加更详细的日志
        console.log('订单数组:', orders.value)
        if (orders.value.length > 0) {
          console.log('第一个订单:', orders.value[0])
          console.log('第一个订单的商品列表:', orders.value[0].order_items)
          if (orders.value[0].order_items?.length > 0) {
            console.log('第一个商品的详细信息:', orders.value[0].order_items[0])
            console.log('第一个商品的图片路径:', orders.value[0].order_items[0]?.goods?.main_image)
          }
        }
      } else {
        orders.value = []
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      ElMessage.error('获取订单列表失败')
      orders.value = []
    } finally {
      loading.value = false
    }
  }
  
  // 处理图片URL
  const getImageUrl = (imagePath) => {
    console.log('原始图片路径:', imagePath)
    // 如果是生产环境，直接使用数据库中的URL
    
    if (process.env.NODE_ENV === 'production') {
      // 生产环境直接使用数据库中的URL
      return imagePath;
    }else{ 
    if (!imagePath) {
      console.log('图片路径为空，返回默认图片')
      return 'https://via.placeholder.com/300'
    }
  
    // 如果路径已经是完整URL，则直接返回
    if (imagePath.startsWith('http')) {
      console.log('完整URL，直接返回:', imagePath)
      return imagePath
    }
    
    // 移除多余的 media 前缀
    let cleanPath = imagePath.replace(/^\/media\/media\//, '/media/')
    if (!cleanPath.startsWith('/media/')) {
      cleanPath = `/media/${cleanPath}`
    }
    
    const fullUrl = `http://localhost:8000${cleanPath}`
    console.log('处理后的完整URL:', fullUrl)
    return fullUrl
    }
  }
  
  // 保存地址
  const saveAddress = async () => {
    try {
      let response
      if (editingAddress.value) {
        response = await updateAddress(editingAddress.value.id, addressForm.value)
      } else {
        response = await addAddress(addressForm.value)
      }
  
      if (response.data.status === 'success') {
        ElMessage.success(t('account.address.saveSuccess'))
        showAddressForm.value = false
        fetchAddresses()
      } else {
        throw new Error(response.data.message || t('account.address.saveFailed'))
      }
    } catch (error) {
      console.error('保存地址失败:', error)
      ElMessage.error(error.message || t('account.address.saveFailed'))
    }
  }
  
  // 删除地址
  const deleteAddressHandler = async (addressId) => {
    try {
      const response = await deleteAddress(addressId)
      if (response.data.status === 'success') {
        ElMessage.success(t('account.address.deleteSuccess'))
        fetchAddresses()
      } else {
        throw new Error(response.data.message || t('account.address.deleteFailed'))
      }
    } catch (error) {
      console.error('删除地址失败:', error)
      ElMessage.error(error.message || t('account.address.deleteFailed'))
    }
  }
  
  // 编辑地址
  const editAddress = (address) => {
    editingAddress.value = address
    addressForm.value = { ...address }
    showAddressForm.value = true
  }
  
  // 设置默认地址
  const toggleDefaultAddress = async (address) => {
    try {
      const response = await updateAddress(address.id, {
        ...address,
        isdefault: !address.isdefault
      })
      if (response.data.status === 'success') {
        fetchAddresses()
      } else {
        throw new Error(response.data.message || t('account.address.setDefaultFailed'))
      }
    } catch (error) {
      console.error('设置默认地址失败:', error)
      ElMessage.error(error.message || t('account.address.setDefaultFailed'))
    }
  }
  
  // 保存实名认证
  const saveRealName = async () => {
    try {
      const data = {
        identity_card: realNameForm.value.identity_card,
        realname: realNameForm.value.realname,
        rUserInfo_id: userStore.userId,  // ✅ 关联当前用户
      };
  
      console.log('提交实名认证数据:', data); 
      const response = await submitRealName(data)
      if (response.data.status === 'success') {
        ElMessage.success(t('account.realName.submitSuccess'))
        fetchRealName()
      } else {
        throw new Error(response.data.message || t('account.realName.submitFailed'))
      }
    } catch (error) {
      console.error('实名认证提交失败:', error)
      ElMessage.error(error.message || t('account.realName.submitFailed'))
    }
  }
  
  // 确认收货
  const handleConfirmReceive = async (orderId) => {
    try {
      const res = await confirmReceive(orderId)
      if (res.status === 'success') {
        ElMessage.success(t('account.order.confirmReceiveSuccess'))
        await fetchOrders()
      }
    } catch (error) {
      ElMessage.error(t('account.order.confirmReceiveFailed'))
    }
  }
  
  // 支付订单
  const handlePayOrder = async (orderId) => {
    try {
      const res = await payOrder(orderId)
      console.log('支付响应:', res)
      if (res.data.message === '支付成功') {
        ElMessage.success(t('account.order.paymentSuccess'))
        await fetchOrders()
      } else {
        throw new Error(res.data.error || t('account.order.paymentFailed'))
      }
    } catch (error) {
      console.error('支付失败:', error)
      ElMessage.error(error.message || t('account.order.paymentFailed'))
    }
  }
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchAddresses()
    fetchRealName()
    if (activeTab.value === 'orders') {
      fetchOrders()
    }
  })
  
  // 监听标签页变化
  watch(activeTab, (newVal) => {
    if (newVal === 'orders') {
      fetchOrders()
    }
  })
  </script>
  
  <style scoped>
  .form-checkbox {
    @apply h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
  }
  </style> 