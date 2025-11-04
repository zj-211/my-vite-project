<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">{{ $t('cart.title') }}</h1>
      
      <div class="bg-white rounded-lg shadow-sm">
        <!-- 表头 -->
        <div class="grid grid-cols-12 gap-4 p-4 border-b text-gray-600">
          <div class="col-span-6">{{ $t('cart.productInfo') }}</div>
          <div></div>
          <div></div>
          <div class="col-span-2 text-center">{{ $t('cart.quantity') }}</div>
          <div class="col-span-2 text-center">{{ $t('cart.price') }}</div>
        </div>
  
        <!-- 购物车列表 -->
        <div v-if="cartStore.items.length > 0">
          <div v-for="item in cartStore.items" :key="item.id" class="grid grid-cols-12 gap-4 p-4 border-b items-center">
            <!-- 商品信息 -->
            <div class="col-span-6 flex items-center space-x-4">
              <img 
                :src="getImageUrl(item.goods.main_image)" 
                :alt="item.goods.gname" 
                class="w-20 h-20 object-cover rounded"
              >
              <div>
                <h3 class="font-medium">{{ item.goods.gname }}</h3>
                <button @click="handleRemoveItem(item.id)" class="text-red-500 text-sm mt-2">
                  <i class="fas fa-trash"></i> {{ $t('cart.remove') }}
                </button>
              </div>
            </div>
            
            <!-- 单价 -->
            <div class="col-span-2 text-center">
              {{ item.prices }}
            </div>
            
            <!-- 数量 -->
            <div class="col-span-2 flex justify-center items-center space-x-2">
              <button 
                @click="handleUpdateQuantity(item.id, item.num - 1)"
                class="px-2 py-1 border rounded"
                :disabled="item.num <= 1"
              >-</button>
              <span class="w-12 text-center">{{ item.num }}</span>
              <button 
                @click="handleUpdateQuantity(item.id, item.num + 1)"
                class="px-2 py-1 border rounded"
              >+</button>
            </div>
            
            <!-- 小计 -->
            <div class="col-span-2 text-center text-blue-600 font-medium">
              {{ item.total_price }}
            </div>
          </div>
        </div>
        
        <!-- 空购物车 -->
        <div v-else class="p-8 text-center text-gray-500">
          {{ $t('cart.empty') }}
        </div>
      </div>
  
      <!-- 底部操作栏 -->
      <div class="mt-8 flex justify-between items-center">
        <button @click="handleClearCart" class="flex items-center text-gray-600">
          <i class="fas fa-trash mr-2"></i> {{ $t('cart.clear') }}
        </button>
        <div class="flex items-center space-x-8">
          <div>
            {{ $t('cart.selectedItems') }} <span class="text-blue-600 font-medium">{{ cartStore.totalItems }}</span> {{ $t('cart.pieces') }}
          </div>
          <div>
            {{ $t('cart.total') }}：<span class="text-2xl text-blue-600 font-bold">¥{{ cartStore.totalPrice.toFixed(1) }}</span>
          </div>
          <button 
            @click="handleCheckout"
            class="bg-blue-600 text-white px-12 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="cartStore.items.length === 0"
          >
            {{ $t('cart.checkout') }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '@/stores/cart'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  const cartStore = useCartStore()
  const router = useRouter()
  const { t } = useI18n()
  
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
  
  // 初始化加载购物车数据
  onMounted(async () => {
    try {
      await cartStore.fetchCartItems()
    } catch (error) {
      console.error('加载购物车失败:', error)
    }
  })
  
  // 更新商品数量
  const handleUpdateQuantity = async (itemId, newNum) => {
    if (newNum < 1) return
    try {
      await cartStore.updateItemQuantity(itemId, newNum)
      ElMessage.success(t('cart.quantityUpdated'))
    } catch (error) {
      ElMessage.error(t('cart.quantityUpdateFailed'))
    }
  }
  
  // 移除商品
  const handleRemoveItem = async (itemId) => {
    try {
      await cartStore.removeItem(itemId)
      ElMessage.success(t('cart.itemRemoved'))
    } catch (error) {
      ElMessage.error(t('cart.itemRemoveFailed'))
    }
  }
  
  // 清空购物车
  const handleClearCart = async () => {
    try {
      // 遍历所有商品并逐个删除
      for (const item of cartStore.items) {
        await cartStore.removeItem(item.id)
      }
      ElMessage.success(t('cart.cartCleared'))
    } catch (error) {
      ElMessage.error(t('cart.cartClearFailed'))
    }
  }
  
  // 处理结算按钮点击
  const handleCheckout = () => {
    if (cartStore.items.length === 0) {
      ElMessage.warning(t('cart.emptyWarning'))
      return
    }
    // 跳转到结算页面，并传递总金额
    router.push({
      path: '/checkout',
      query: {
        total: cartStore.totalPrice
      }
    })
  }
  </script>
  
  <style scoped>
  /* 移除数字输入框的上下箭头 */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* 行溢出省略 */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style> 