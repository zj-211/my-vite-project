<template>
  <div class="min-h-screen bg-white">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm fixed w-full z-50">
      <div class="container mx-auto px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-3">
            <img src="@/assets/logo.png" alt="奢侈品" class="h-40 w-40 object-contain" />
            <router-link to="/" class="text-2xl font-bold text-gray-800 tracking-tight">
              <!-- 奢侈品 -->
              {{ $t('nav.global') }}
            </router-link>
          </div>
          <div class="flex items-center space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider">
              <!-- 首页 -->
              {{ $t('nav.home') }}
            </router-link>
            
            <!-- 分类下拉菜单 -->
            <div class="relative dropdown">
              <button class="text-gray-600 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider flex items-center dropdown-toggle">
                <!-- 分类 -->
                {{ $t('nav.categories') }}
                <i class="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div class="dropdown-menu absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <div v-if="categoryStore.isLoading" class="px-4 py-2 text-gray-500">加载中...</div>
                <div v-else-if="categoryStore.error" class="px-4 py-2 text-red-500">{{ categoryStore.error }}</div>
                <div v-else-if="categoryStore.categories.length === 0" class="px-4 py-2 text-gray-500">{{ $t('nav.notFoundCategories') }}</div>
                <router-link 
                  v-else
                  v-for="category in categoryStore.categories" 
                  :key="category.id"
                  :to="`/category/${category.id}`"
                  class="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                  {{ category.cname }}
                </router-link>
              </div>
            </div>

            <router-link to="/cart" class="text-gray-600 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider relative">
              {{ $t('nav.cart') }}
              <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {{ cartStore.totalItems }}
              </span>
            </router-link>
            <!-- 添加语言切换组件（建议放在这里） -->
            <LanguageSwitcher class="ml-4" />
            <!-- 用户账号 -->
            <div v-if="userStore.isLoggedIn" class="relative dropdown">
              <button class="text-gray-600 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider flex items-center dropdown-toggle">
                <span>{{ userStore.$state.username }}</span>
                <i class="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div class="dropdown-menu absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <router-link to="/account" class="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                  {{ $t('nav.userDropdown.profile') }}
                </router-link>
                <button @click="handleLogout" class="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 w-full text-left">
                  {{ $t('nav.userDropdown.logout') }}
                </button>
              </div>
            </div>
            
            <!-- 未登录时显示"我的" -->
            <router-link 
              v-else 
              to="/account" 
              class="text-gray-600 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider"
            >
              <!-- 我的 -->
              {{ $t('nav.my') }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="pt-20">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { useCategoryStore } from './stores/category';
import { useCartStore } from './stores/cart';
import { ElMessage } from 'element-plus';
import { logout } from './api/user';

const router = useRouter();
const userStore = useUserStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();

// 在组件挂载时获取分类数据
onMounted(async () => {
  // 初始化用户状态
  userStore.initializeStore();
  if (userStore.isLoggedIn) {
    try {
      await categoryStore.fetchCategories();
      console.log('分类数据加载成功：', categoryStore.categories);
    } catch (error) {
      console.error('加载分类数据时出错：', error);
    }
  } else {
    console.log('用户未登录，无法获取分类数据');
  }
});


// 处理退出登录
const handleLogout = async () => {
  try {
    await logout();
    // localStorage.removeItem('token'); // 清除本地存储的 token
    await userStore.clearUser();
    // await cartStore.clearCart();
    ElMessage.success('退出登录成功');
    await router.push('/auth');
  } catch (error) {
    console.error('退出登录错误:', error);
    await userStore.clearUser();
    // await cartStore.clearCart();
    ElMessage.warning('退出操作可能未完全成功，但您已在本地登出');
    await router.push('/auth');
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 添加下拉菜单样式 */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  min-width: 10rem;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style> 