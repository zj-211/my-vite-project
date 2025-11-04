<template>
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin text-2xl">
          <i class="fas fa-spinner fa-pulse"></i> 
        </div>
        <p class="mt-2">{{ $t('goods.loading') }}</p>
      </div>
  
      <div v-else-if="error" class="text-center py-8 text-red-500">
        <i class="fas fa-exclamation-triangle"></i>
        <p class="mt-2">{{ $t('goods.error') }}</p>
      </div>
  
      <div v-else-if="!goods" class="text-center py-8">
        <i class="fas fa-exclamation-triangle"></i>
        <p class="mt-2">{{ $t('goods.notFound') }}</p>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 商品图片 -->
        <div class="relative">
          <img 
            :src="getImageUrl(selectedImage?.gdurl || goods.images.find(img => img.is_main)?.gdurl || '')" 
            :alt="goods.gname"
            class="w-full rounded-lg shadow-lg"
          >
          <div class="flex mt-4 gap-2 overflow-x-auto">
            <img 
              v-for="image in goods.images" 
              :key="image.id"
              :src="getImageUrl(image.gdurl)"
              @click="selectedImage = image"
              :class="['w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity',
                selectedImage?.id === image.id ? 'border-2 border-primary' : '']"
              :alt="goods.gname"
            >
          </div>
        </div>
  
        <!-- 商品信息 -->
        <div class="space-y-6">
          <h1 class="text-2xl font-bold">{{ goods.gname }}</h1>
          
          <!-- 商品标签 -->
          <div class="flex gap-2">
            <span v-if="goods.is_hot" class="px-2 py-1 bg-red-500 text-white rounded text-sm">
              {{ $t('goods.hot') }}
            </span>
            <span v-if="goods.is_new" class="px-2 py-1 bg-green-500 text-white rounded text-sm">
              {{ $t('goods.new') }}
            </span>
          </div>
  
          <!-- 商品描述 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-2">{{ $t('goods.product.description') }}</h2>
            <div class="prose max-w-none text-gray-600" v-html="goods.gdesc"></div>
          </div>
          
          <!-- 价格和基本信息 -->
          <div class="space-y-4">
            <p class="text-3xl font-bold text-primary">¥{{ goods.price }}</p>
            
            <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span class="text-gray-600">{{ $t('goods.brand') }}:</span>
                <span class="ml-2 font-medium">{{ goods.brand }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('goods.category') }}:</span>
                <span class="ml-2 font-medium">{{ goods.category.cname }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('goods.stock') }}:</span>
                <span class="ml-2 font-medium">{{ goods.stock }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ $t('goods.sales') }}:</span>
                <span class="ml-2 font-medium">{{ goods.sales }}</span>
              </div>
            </div>
  
            <!-- 数量选择和加入购物车 -->
            <div class="space-y-4 mt-6">
              <div class="flex items-center gap-4">
                <span class="text-gray-600">{{ $t('goods.quantity') }}:</span>
                <el-input-number 
                  v-model="quantity" 
                  :min="1" 
                  :max="goods.stock"
                  :disabled="goods.stock === 0"
                  size="large"
                />
              </div>
  
              <div class="flex gap-4">
                <el-button 
                  type="primary" 
                  :disabled="goods.stock === 0 || !goods"
                  @click="handleAddToCart"
                  size="large"
                  class="w-full md:w-auto"
                >
                  <el-icon class="mr-1"><ShoppingCart /></el-icon>
                  {{ goods.stock === 0 ? $t('goods.outOfStock') : $t('goods.addToCart') }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 添加到购物车的提示 -->
      <el-message
        v-if="showAddToCartToast"
        :message="$t('goods.addedToCart')"
        type="success"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getGoodsDetail } from '@/api/home'
  import { useCartStore } from '@/stores/cart'
  import { ElMessage,ElIcon } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { ShoppingCart } from '@element-plus/icons-vue'
  
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const cartStore = useCartStore()
  
  const goods = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const selectedImage = ref('')
  const quantity = ref(1)
  const showAddToCartToast = ref(false)
  
  const fetchGoodsDetail = async (goodsId) => {
    loading.value = true
    error.value = null
    try {
      const response = await getGoodsDetail(goodsId)
      if (response.data.status === 'success') {
        goods.value = response.data.goods
        console.log('商品详情数据:', goods.value)
        
        // 默认选中主图
        const mainImage = goods.value.images.find(img => img.is_main)
        selectedImage.value = mainImage || null
      } else {
        throw new Error(response.data.message || t('goods.loadError'))
      }
    } catch (err) {
      console.error('加载商品详情错误:', err)
      error.value = err.message || t('goods.serverError')
      goods.value = null
    } finally {
      loading.value = false
    }
  }
  
  const handleQuantityChange = (type) => {
    if (type === 'add') {
      quantity.value++
    } else if (type === 'subtract' && quantity.value > 1) {
      quantity.value--
    }
  }
  
  // 处理图片URL
  const getImageUrl = (imagePath) => {
    // 如果是生产环境，直接使用数据库中的URL
    
    if (process.env.NODE_ENV === 'production') {
      // 生产环境直接使用数据库中的URL
      return imagePath;
    }else{
  
    // 如果路径已经是完整URL，则直接返回
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 如果路径包含 /media 但不是完整URL，则添加后端基础URL
    if (imagePath && imagePath.includes('/media')) {
      // 确保路径不重复包含 /media
      const cleanPath = imagePath.replace(/^\/media\/media\//, '/media/');
      return `http://localhost:8000${cleanPath}`;
    }
    
    // 如果只是文件名，则构建完整路径
    if (imagePath) {
      return `http://localhost:8000/media/${imagePath}`;
    }
    
    // 默认返回占位符图片
    return 'https://via.placeholder.com/300';
  }
  };
  
  const handleAddToCart = async () => {
    try {
      if (!goods.value) {
        ElMessage.error(t('goods.loadError'));
        return;
      }
  
      if (goods.value.stock === 0) {
        ElMessage.warning(t('goods.outOfStockMessage'));
        return;
      }
  
      if (quantity.value > goods.value.stock) {
        ElMessage.warning(t('goods.maxQuantityMessage', { stock: goods.value.stock }));
        return;
      }
  
      await cartStore.addItem(
        goods.value.id,
        quantity.value
      );
  
      ElMessage.success(t('goods.addedToCart'));
      
      // 重置数量
      quantity.value = 1;
    } catch (error) {
      console.error('添加到购物车失败:', error);
      ElMessage.error(t('goods.addToCartError'));
    }
  };
  
  // 监听路由参数变化
  watch(
    () => route.params.goods_id,
    (newGoodsId) => {
      if (newGoodsId) {
        fetchGoodsDetail(newGoodsId)
        quantity.value = 1 // 重置数量
      }
    },
    { immediate: true } // 立即执行一次
  )
  
  // 组件挂载时如果路由参数已存在，则获取数据
  onMounted(() => {
    if (route.params.goods_id) {
      fetchGoodsDetail(route.params.goods_id)
    }
  })
  </script>
  
  <style scoped>
  /* 添加淡入动画 */
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
  
  /* 修改输入框样式 */
  :deep(.el-input-number) {
    width: 150px;
  }
  
  :deep(.el-input-number .el-input__wrapper) {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
  }
  
  :deep(.el-button) {
    height: 44px;
    font-size: 16px;
  }
  
  /* 商品描述样式 */
  :deep(.prose) {
    font-size: 14px;
    line-height: 1.6;
  }
  
  :deep(.prose p) {
    margin-bottom: 1em;
  }
  
  :deep(.prose img) {
    border-radius: 8px;
    margin: 1em 0;
  }
  </style> 