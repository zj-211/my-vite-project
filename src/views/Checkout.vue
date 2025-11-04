<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">{{ $t('checkout.title') }}</h2>
      
      <!-- 加载指示器 -->
      <!-- <el-loading v-if="loading" style="position: fixed; z-index: 2000; top: 50%; left: 50%; transform: translate(-50%, -50%);"></el-loading> -->
  
      <!-- 收货地址 -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">{{ $t('checkout.shipping.title') }}</h3>
          <button @click="showAddressDialog = true" class="text-blue-600">
            <i class="fas fa-plus"></i> {{ $t('checkout.shipping.addNew') }}
          </button>
        </div>
        
        <!-- 地址列表 -->
        <div v-if="addressList.length > 0" class="space-y-4">
          <div 
            v-for="address in addressList" 
            :key="address.id"
            class="border p-4 rounded-lg cursor-pointer"
            :class="{'border-blue-500 bg-blue-50': selectedAddress?.id === address.id}"
            @click="selectAddress(address)"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ address.aname }} {{ address.aphone }}</p>
                <p class="text-gray-600 mt-2">{{ address.addr }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="address.isdefault" class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  {{ $t('checkout.shipping.default') }}
                </span>
                <input 
                  type="radio" 
                  :checked="selectedAddress?.id === address.id"
                  class="w-4 h-4 text-blue-600"
                  @change="selectAddress(address)"
                >
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无地址时显示 -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500 mb-4">{{ $t('checkout.shipping.noAddress') }}</p>
          <button 
            @click="showAddressDialog = true"
            class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {{ $t('checkout.shipping.addNew') }}
          </button>
        </div>
      </div>
  
      <!-- 商品清单 -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h3 class="text-lg font-medium mb-4">{{ $t('checkout.order.title') }}</h3>
        <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center py-4 border-b">
          <div class="flex items-center">
            <img :src="getImageUrl(item.goods.main_image)" :alt="item.goods.gname" class="w-16 h-16 object-cover rounded">
            <div class="ml-4">
              <p class="font-medium">{{ item.goods.gname }}</p>
              <p class="text-gray-500 text-sm">{{ $t('checkout.order.quantity') }}：{{ item.num }}</p>
            </div>
          </div>
          <div class="text-red-600">¥{{ item.price }}</div>
        </div>
      </div>
  
      <!-- 订单总结 -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ $t('checkout.order.total') }}：</span>
          <span class="text-2xl text-red-600 font-bold">¥{{ totalPrice }}</span>
        </div>
      </div>
  
      <!-- 提交订单按钮 -->
      <div class="flex justify-center">
        <button 
          @click="handleSubmitOrder"
          class="bg-red-600 text-white px-12 py-3 rounded-lg text-lg hover:bg-red-700 disabled:bg-gray-400"
          :disabled="!selectedAddress || !isVerified"
        >
          {{ $t('checkout.submit') }}
        </button>
      </div>
  
      <!-- 添加地址弹窗 -->
      <el-dialog
        v-model="showAddressDialog"
        :title="$t('checkout.shipping.addNew')"
        width="500px"
        :close-on-click-modal="false"
      >
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.shipping.name') }}</label>
            <el-input v-model="addressForm.aname" :placeholder="$t('checkout.shipping.namePlaceholder')" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.shipping.phone') }}</label>
            <el-input v-model="addressForm.aphone" :placeholder="$t('checkout.shipping.phonePlaceholder')" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.shipping.address') }}</label>
            <el-input
              v-model="addressForm.addr"
              type="textarea"
              rows="3"
              :placeholder="$t('checkout.shipping.addressPlaceholder')"
            />
          </div>
          <div class="mb-4">
            <el-checkbox v-model="addressForm.isdefault">{{ $t('checkout.shipping.setDefault') }}</el-checkbox>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-4">
            <el-button @click="showAddressDialog = false">{{ $t('checkout.cancel') }}</el-button>
            <el-button type="primary" @click="handleSaveAddress">{{ $t('checkout.save') }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { ElMessage, ElDialog, ElButton, ElInput, ElCheckbox, ElLoading } from 'element-plus'
  import request from '@/utils/request'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  
  const { t } = useI18n()
  const router = useRouter()
  const cartStore = useCartStore()
  const addressList = ref([])
  const selectedAddress = ref(null)
  const cartItems = ref([])
  const totalPrice = ref(0)
  const isVerified = ref(false)
  const showAddressDialog = ref(false)
  const loading = ref(false)
  
  const addressForm = ref({
    aname: '',
    aphone: '',
    addr: '',
    isdefault: false
  })
  
  // 获取实名认证状态
  const checkVerificationStatus = async () => {
    try {
      const response = await request.get('/api/user/verification/status/')
      isVerified.value = response.data.is_verified
      if (!isVerified.value) {
        ElMessage.warning(t('checkout.verificationRequired'))
        router.push('/api/user/realname/')
      }
    } catch (error) {
      console.error('Failed to get verification status:', error)
    }
  }
  
  // 获取地址列表
  const fetchAddressList = async () => {
    try {
      const response = await request.get('/api/user/addresses/')
      if (response.data.status === 'success') {
        addressList.value = response.data.addresses
        // 如果有默认地址，自动选中
        const defaultAddr = addressList.value.find(addr => addr.isdefault)
        if (defaultAddr) {
          selectedAddress.value = defaultAddr
        }
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
    }
  }
  
  // 保存地址
  const handleSaveAddress = async () => {
    try {
      const response = await request.post('/api/user/addresses/', addressForm.value)
      if (response.data.status === 'success') {
        ElMessage.success('地址添加成功')
        showAddressDialog.value = false
        // 重新获取地址列表
        await fetchAddressList()
        // 如果是默认地址或者是第一个地址，自动选中
        if (addressForm.value.isdefault || addressList.value.length === 1) {
          selectedAddress.value = response.data.address
        }
        // 重置表单
        addressForm.value = {
          aname: '',
          aphone: '',
          addr: '',
          isdefault: false
        }
      }
    } catch (error) {
      ElMessage.error('添加地址失败：' + error.message)
    }
  }
  
  // 选择地址
  const selectAddress = (address) => {
    selectedAddress.value = address
  }
  
  // 获取购物车数据
  const fetchCartItems = async () => {
    try {
      const response = await request.get('/api/cart/detail/')
      if (response.data.status === 'success') {
        cartItems.value = response.data.cart
        calculateTotal()
      }
    } catch (error) {
      console.error('获取购物车数据失败:', error)
    }
  }
  
  // 计算总价
  const calculateTotal = () => {
    totalPrice.value = cartItems.value.reduce((sum, item) => sum + item.price * item.num, 0)
  }
  
  // // 提交订单
  // const handleSubmitOrder = async () => {
  //   if (!isVerified.value) {
  //     ElMessage.warning('请先完成实名认证')
  //     router.push('/api/user/realname/')
  //     return
  //   }
  
  //   if (!selectedAddress.value) {
  //     ElMessage.warning('请选择收货地址')
  //     return
  //   }
  
  //   // 验证购物车
  //   if (cartItems.value.length === 0) {
  //     ElMessage.warning('购物车为空，请添加商品')
  //     return
  //   }
  
  // try {
  //     loading.value = true
      
  //     // 调试输出
  //     console.log('请求数据:', {
  //       address_id: selectedAddress.value.id,
  //       cart_items: cartItems.value,
  //       user: request.user  // 确保用户信息存在
  //     })
  //     // 在提交前打印令牌
  //     console.log('当前Token:', localStorage.getItem('token'))
  
  //     // 构造请求数据
  //     const requestData = {
  //       address_id: Number(selectedAddress.value.id),
  //       // 添加购物车商品信息（根据后端需求）
  //       items: cartItems.value.map(item => ({
  //         goods_id: item.goods.id,
  //         quantity: item.num
  //       }))
  //     }
  
  //     // 发送请求
  //     const response = await axios.post('/api/order/checkout/', requestData, {
  //       address_id: selectedAddress.value.id,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}` // 确保认证
  //       }
  //     })
  
  //     // 处理响应
  //     if (response.data.status === 'success') {
  //       ElMessage.success('订单创建成功');
  //       await cartStore.clearCart();
  //       router.push(`/order/${response.data.order_id}`);
  //     } else {
  //       throw new Error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('订单创建失败:', error);
  //     ElMessage.error(error.message || '订单创建失败');
  //   } finally {
  //     loading.value = false;
  //   }
  
  //   //   // 特殊处理实名认证错误
  //   //   if (errorMessage.includes('实名认证')) {
  //   //     router.push('/api/user/realname/')
  //   //   }
      
  //   //   ElMessage.error(`错误: ${errorMessage}`)
  //   // } finally {
  //   //   loading.value = false
  //   // }
  // };
  const handleSubmitOrder = async () => {
    try {
      loading.value = true;
      // const token = localStorage.getItem('token');
      // 1. 基础验证
      if (!isVerified.value || !selectedAddress.value || cartItems.value.length === 0) {
        throw new Error('请完成认证、选择地址并添加商品');
      }
  
      // 2. 打印调试信息
      console.log('当前Token:', localStorage.getItem('token'));
      console.log('请求地址ID:', selectedAddress.value.id);
  
      // 3. 发送请求（修正后的版本）
      const response = await request.post(
        '/api/order/checkout/',
        { address_id: Number(selectedAddress.value.id) },  // 只需要传地址ID
        // {
        //   headers: {
        //     'Authorization': `Bearer ${token.trim()}`, // 确保有空格且无多余字符
        //     'Content-Type': 'application/json'
        //   }
        // }
      );
  
      // 4. 处理响应
      if (response.data.status === 'success') {
        ElMessage.success('订单创建成功');
        await cartStore.clearCart();
        // router.push(`/api/order/orders/${response.data.order_id}`);
        router.push(`/account/`);
      } else {
        throw new Error(response.data.message || '未知错误');
      }
    } catch (error) {
      console.error('完整错误:', {
        config: error.config?.headers,
        message: error.message,
        response: error.response?.data
      });
      ElMessage.error(error.message || '订单创建失败');
    } finally {
      loading.value = false;
    }
  };
  
  // 处理图片URL
  const getImageUrl = (imagePath) => {
    // 如果是生产环境，直接使用数据库中的URL
    
    if (process.env.NODE_ENV === 'production') {
      // 生产环境直接使用数据库中的URL
      return imagePath;
    }else{  
    if (!imagePath) return '';
    
    // 移除开头的斜杠（如果存在）
    imagePath = imagePath.replace(/^\/+/, '');
    
    // 如果路径已经是完整URL，则直接返回
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 如果路径包含 media，确保路径格式正确
    if (imagePath.includes('media')) {
      // 提取media后面的实际文件路径
      const pathParts = imagePath.split('media/');
      const actualPath = pathParts[pathParts.length - 1];
      return `http://localhost:8000/media/${actualPath}`;
    }
    
    // 如果只是文件名，则构建完整路径
    return `http://localhost:8000/media/${imagePath}`;
  }
  };
  
  
  onMounted(() => {
    fetchAddressList()
    fetchCartItems()
    checkVerificationStatus()
  })
  </script> 