<template>
    <div>
      <!-- 搜索区域 -->
      <div class="search-area bg-gradient-to-r from-blue-50 to-indigo-50 py-24">
        <div class="container mx-auto px-8">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-6">{{ $t('home.search.title') }}</h2>
            <p class="text-gray-600 mb-12">{{ $t('home.search.subtitle') }}</p>
            <div class="flex bg-white rounded-full shadow-lg p-2">
              <input 
                v-model="searchQuery" 
                type="text" 
                :placeholder="$t('home.search.placeholder')" 
                class="flex-1 px-8 py-4 rounded-l-full focus:outline-none text-gray-600"
              >
              <button 
                @click="handleSearch" 
                class="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                {{ $t('home.search.button') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 轮播图区域 -->
      <div class="container mx-auto px-8 py-16">
        <div class="relative overflow-hidden rounded-3xl shadow-xl">
          <div class="carousel-container">
            <div 
              v-for="(slide, index) in slides" 
              :key="index"
              :class="['carousel-slide', { active: currentSlide === index }]"
            >
              <img :src="slide.image" :alt="slide.title" class="w-full h-[600px] object-contain bg-white">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-12 text-white">
                <h3 class="text-4xl font-bold mb-4">{{ $t(`home.carousel.${slide.key}.title`) }}</h3>
                <p class="text-lg opacity-90">{{ $t(`home.carousel.${slide.key}.description`) }}</p>
              </div>
            </div>
          </div>
          <button 
            @click="prevSlide" 
            class="carousel-button prev absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full hover:bg-white shadow-lg"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            @click="nextSlide" 
            class="carousel-button next absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full hover:bg-white shadow-lg"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <div class="carousel-dots absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <button 
              v-for="(slide, index) in slides" 
              :key="index"
              @click="goToSlide(index)"
              :class="['dot w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all', { active: currentSlide === index }]"
            ></button>
          </div>
        </div>
      </div>
  
      <!-- 商品分类 -->
      <div class="container mx-auto px-8 py-20">
        <h2 class="text-3xl font-bold mb-16 text-gray-800 text-center">{{ $t('home.categories.title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <router-link 
            v-for="category in categories" 
            :key="category.id"
            :to="category.route"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div class="relative overflow-hidden">
              <img :src="category.image" :alt="category.name" class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6">
              <p class="text-lg font-medium text-gray-800">{{ $t(`home.categories.${category.key}`) }}</p>
            </div>
          </router-link>
        </div>
      </div>
  
      <!-- 热门商品 -->
      <div class="container mx-auto px-8 py-20 bg-gray-50">
        <h2 class="text-3xl font-bold mb-16 text-gray-800 text-center">{{ $t('home.products.title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div class="relative overflow-hidden">
              <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 mb-2">{{ product.name }}</h3>
              <p class="text-xl font-bold text-blue-600 mb-4">¥{{ product.price }}</p>
              <button 
                @click="addToCart(product)"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <i class="fas fa-shopping-cart"></i>
                <span>{{ $t('home.products.addToCart') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 加入购物车提示 -->
      <div 
        v-if="showAddToCartToast"
        class="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up"
      >
        <i class="fas fa-check-circle"></i>
        <span>{{ lastAddedProduct?.name }} {{ $t('home.products.addedToCart') }}</span>
      </div>
  
      <!-- 全球品牌 -->
      <div class="container mx-auto px-8 py-20">
        <h2 class="text-3xl font-bold mb-16 text-gray-800 text-center">{{ $t('home.brands.title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div 
            v-for="brand in brands" 
            :key="brand.id"
            class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center"
          >
            <div class="relative overflow-hidden rounded-xl mb-4">
              <img :src="brand.image" :alt="brand.name" class="w-24 h-24 mx-auto object-contain transform group-hover:scale-105 transition-transform duration-500">
            </div>
            <p class="text-lg font-medium text-gray-800">{{ brand.name }}</p>
          </div>
        </div>
      </div>
  
      <!-- 添加页脚 -->
      <Footer />
    
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useCartStore } from '../stores/cart'
  import { getCategories, getHotGoods } from '../api/home'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import Footer from '../components/Footer.vue'
  import ModelViewer from '../components/ModelViewer.vue'
  
  const { t } = useI18n()
  const cartStore = useCartStore()
  
  // 搜索功能
  const searchQuery = ref('')
  const handleSearch = () => {
    console.log('Search:', searchQuery.value)
  }
  
  // 轮播图数据
  const slides = ref([
    {
      key: 'beauty',
      image: new URL('../assets/images/categories/bag2.webp', import.meta.url).href,
    },
    {
      key: 'clothing',
      image: new URL('../assets/images/categories/clothes.png', import.meta.url).href,
    },
    {
      key: 'food',
      image: new URL('../assets/images/categories/shoes.png', import.meta.url).href, // 修改为bag1.webp
    }
  ])
  
  // 分类数据
  const categories = ref([
    {
      id: 'bag',
      key: 'bag',
      image: new URL('../assets/images/categories/包包.png', import.meta.url).href,
      route: '/category/bag'
    },
    {
      id: 'beauty',
      key: 'beauty',
      image: new URL('../assets/images/categories/美妆.png', import.meta.url).href,
      route: '/category/beauty'
    },
    {
      id: 'fashion',
      key: 'fashion',
      image: new URL('../assets/images/categories/衣服.png', import.meta.url).href,
      route: '/category/fashion'
    },
    {
      id: 'electronics',
      key: 'electronics',
      image: new URL('../assets/images/categories/首饰.png', import.meta.url).href,
      route: '/category/electronics'
    },
    {
      id: 'home',
      key: 'home',
      image: new URL('../assets/images/categories/鞋子.png', import.meta.url).href,
      route: '/category/home'
    }
  ])
  
  // 商品数据
  const products = ref([])
  // 品牌数据
  const brands = ref([
    {
      id: 1,
      name: 'Van Cleef & Arpels',
      image: new URL('../assets/images/brands/Van Cleef & Arpels.png', import.meta.url).href
    },
    {
      id: 2,
      name: 'YSL',
      image: new URL('../assets/images/brands/ysl.png', import.meta.url).href
    },
    {
      id: 3,
      name: 'Dior',
      image: new URL('../assets/images/brands/Dior.png', import.meta.url).href
    },
    {
      id: 4,
      name: 'Louis Vuitton',
      image: new URL('../assets/images/brands/Louis Vuitton.png', import.meta.url).href
    },
    {
      id: 5,
      name: 'Gucci',
      image: new URL('../assets/images/brands/Gucci.png', import.meta.url).href
    },
    {
      id: 6,
      name: 'Chanel',
      image: new URL('../assets/images/brands/Chanel.png', import.meta.url).href
    },
    {
      id: 7,
      name: 'Cleverkeych',
      image: new URL('../assets/images/brands/ck.png', import.meta.url).href
    },
    {
      id: 8,
      name: 'MCM',
      image: new URL('../assets/images/brands/mcm.png', import.meta.url).href
    },
  ])
  
  // 获取首页数据
  const fetchHomeData = async () => {
  try {
    const response = await getHotGoods()

    // 增加防御式校验，防止 undefined 报错
    const data = response?.data
    if (data?.status === 'success') {
      products.value = data.products || []
    } else {
      console.warn('接口返回异常:', data)
      ElMessage.warning('获取商品数据失败，请稍后再试')
    }
  } catch (error) {
    console.error('获取首页数据错误:', error)
    ElMessage.error('网络请求失败，请检查网络连接')
  }
}
  // 轮播图功能
  const currentSlide = ref(0)
  let slideInterval
  
  const goToSlide = (n) => {
    currentSlide.value = (n + slides.value.length) % slides.value.length
  }
  
  const nextSlide = () => {
    goToSlide(currentSlide.value + 1)
  }
  
  const prevSlide = () => {
    goToSlide(currentSlide.value - 1)
  }
  
  const startSlideShow = () => {
    slideInterval = setInterval(() => {
      nextSlide()
    }, 5000)
  }
  
  const stopSlideShow = () => {
    clearInterval(slideInterval)
  }
  
  // 加入购物车功能
  const showAddToCartToast = ref(false)
  const lastAddedProduct = ref(null)
  
  const addToCart = async (product) => {
    try {
      // 检查商品ID是否存在
      if (!product || !product.id) {
        ElMessage.error('商品信息不完整')
        return
      }
  
      console.log('正在添加商品到购物车:', product)
      const result = await cartStore.addItem(product.id)
      
      if (result) {
        lastAddedProduct.value = product
        showAddToCartToast.value = true
        ElMessage.success('成功添加到购物车')
        
        // 立即刷新购物车数据
        await cartStore.fetchCartItems()
        
        setTimeout(() => {
          showAddToCartToast.value = false
        }, 2000)
      } else {
        ElMessage.error('添加到购物车失败，请重试')
      }
    } catch (error) {
      console.error('添加到购物车失败:', error)
      const errorMessage = error.response?.data?.message || '添加到购物车失败'
      ElMessage.error(errorMessage)
    }
  }
  
  onMounted(() => {
    fetchHomeData()
    startSlideShow()
  })
  
  onUnmounted(() => {
    stopSlideShow()
  })
  </script>
  
  <style scoped>
  .search-area {
    background-image: url('@/assets/home背景.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }
  
  .search-area::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    pointer-events: none;
  }
  
  .search-area > * {
    position: relative;
    z-index: 1;
  }
  
  .carousel-container {
    position: relative;
    width: 100%;
    height: 600px;
  }
  
  .carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
  
  .carousel-slide.active {
    opacity: 1;
  }
  
  .carousel-button {
    transition: all 0.3s ease;
  }
  
  .carousel-button:hover {
    transform: scale(1.1) translateY(-50%);
  }
  
  .dot.active {
    background-color: rgba(255, 255, 255, 0.9);
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .carousel-container {
      height: 300px;
    }
  }
  
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
    animation: fade-in-up 0.3s ease-out;
  }
  </style> 