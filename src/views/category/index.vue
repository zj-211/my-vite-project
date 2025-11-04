<template>
  <div class="container mx-auto px-8 py-16">
    <div v-if="categoryId === 'bag'">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">包包</h1>
      <ModelViewer />
      <!-- 包包静态商品列表 -->
      <div v-if="goods.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
        <div v-for="product in goods" :key="product.id"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div class="relative overflow-hidden">
            <img :src="product.main_image" :alt="product.gname"
              class="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div v-if="product.is_hot" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">热销</div>
            <div v-if="product.is_new" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">新品</div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-2 truncate">{{ product.gname }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ product.brand }}</p>
            <p class="text-xl font-bold text-blue-600 mb-4">¥{{ product.price }}</p>
            <button class="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-eye"></i>
              <span>查看详情</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16">
        <p class="text-gray-500">暂无商品</p>
      </div>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold mb-8 text-gray-800">{{ categoryName }}</h1>
      <div v-if="goods.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="product in goods" :key="product.id"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div class="relative overflow-hidden">
            <img :src="product.main_image" :alt="product.gname"
              class="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div v-if="product.is_hot" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">热销</div>
            <div v-if="product.is_new" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">新品</div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-2 truncate">{{ product.gname }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ product.brand }}</p>
            <p class="text-xl font-bold text-blue-600 mb-4">¥{{ product.price }}</p>
            <button class="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-eye"></i>
              <span>查看详情</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16">
        <p class="text-gray-500">暂无商品</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModelViewer from '../../components/ModelViewer.vue'

const route = useRoute()
const rawCategoryId = computed(() => route.params.id)
const categoryId = computed(() => (rawCategoryId.value || '').trim().toLowerCase())

// 静态分类名映射
const categoryNameMap = {
  bag: '包包',
  beauty: '美妆',
  fashion: '衣服',
  electronics: '首饰',
  home: '鞋子'
}
const categoryName = computed(() => categoryNameMap[categoryId.value] || '未知分类')

// 静态商品数据
const goods = computed(() => {
  const key = categoryId.value
  if (key === 'bag') {
    return [
      { id: 1, gname: '时尚女包', brand: '品牌A', price: 12299, main_image: '/src/assets/images/category/bag2.webp', is_hot: true, is_new: false },
      { id: 2, gname: '经典手提包', brand: '品牌B', price: 1599, main_image: 'https://via.placeholder.com/300', is_hot: false, is_new: true }
    ]
  } else if (key === 'beauty') {
    return [
      { id: 3, gname: '口红', brand: '品牌C', price: 199, main_image: 'https://via.placeholder.com/300', is_hot: true, is_new: false }
    ]
  } else if (key === 'fashion') {
    return [
      { id: 4, gname: '时尚连衣裙', brand: '品牌D', price: 999, main_image: 'https://via.placeholder.com/300', is_hot: false, is_new: true }
    ]
  } else if (key === 'electronics') {
    return [
      { id: 5, gname: '项链', brand: '品牌E', price: 2999, main_image: 'https://via.placeholder.com/300', is_hot: false, is_new: false }
    ]
  } else if (key === 'home') {
    return [
      { id: 6, gname: '运动鞋', brand: '品牌F', price: 599, main_image: 'https://via.placeholder.com/300', is_hot: true, is_new: true }
    ]
  }
  return []
})

watch(categoryId, (val) => {
  console.log('categoryId变化:', val)
}, { immediate: true })
</script>

<style scoped>
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
</style> 