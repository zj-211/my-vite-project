<template>
    <div class="bg-white rounded-lg shadow-sm p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('settings.title') }}</h2>
      
      <div class="border-b border-gray-200 pb-6 mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">{{ $t('settings.profile.title') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label class="block text-sm text-gray-700 mb-2" for="username">{{ $t('settings.profile.username') }}</label>
            <input 
              id="username"
              type="text"
              v-model="userInfo.username"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm text-gray-700 mb-2" for="email">{{ $t('settings.profile.email') }}</label>
            <input 
              id="email"
              type="email"
              v-model="userInfo.email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm text-gray-700 mb-2" for="phone">{{ $t('settings.profile.phone') }}</label>
              <input 
              id="phone"
              type="tel"
                v-model="userInfo.phone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
          </div>
          
          <div>
            <label class="block text-sm text-gray-700 mb-2" for="nickname">{{ $t('settings.profile.nickname') }}</label>
              <input 
              id="nickname"
              type="text"
              v-model="userInfo.nickname"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
        
        <button 
          @click="saveUserInfo"
          class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ $t('settings.profile.save') }}
        </button>
      </div>
  
      <div class="border-b border-gray-200 pb-6 mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">{{ $t('settings.password.title') }}</h3>
        
        <div class="space-y-4">
            <div>
            <label class="block text-sm text-gray-700 mb-2" for="current-password">{{ $t('settings.password.current') }}</label>
            <input 
              id="current-password"
              type="password"
              v-model="passwordForm.currentPassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
            <div>
            <label class="block text-sm text-gray-700 mb-2" for="new-password">{{ $t('settings.password.new') }}</label>
            <input 
              id="new-password"
              type="password"
              v-model="passwordForm.newPassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
      </div>
  
            <div>
            <label class="block text-sm text-gray-700 mb-2" for="confirm-password">{{ $t('settings.password.confirm') }}</label>
            <input 
              id="confirm-password"
              type="password"
              v-model="passwordForm.confirmPassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
        </div>
      </div>
  
        <button 
          @click="changePassword"
          class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm. newPassword!== passwordForm.confirmPassword"
        >
          {{ $t('settings.password.change') }}
        </button>
      </div>
  
      <div>
        <h3 class="text-lg font-medium text-gray-800 mb-4">{{ $t('settings.security.title') }}</h3>
        
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-medium text-gray-800">{{ $t('settings.security.logout.title') }}</h4>
              <p class="text-sm text-gray-500">{{ $t('settings.security.logout.description') }}</p>
            </div>
            <button 
              @click="logout"
              class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              {{ $t('settings.security.logout.button') }}
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-medium text-gray-800">{{ $t('settings.security.delete.title') }}</h4>
              <p class="text-sm text-gray-500">{{ $t('settings.security.delete.description') }}</p>
            </div>
            <button 
              @click="confirmDeleteAccount"
              class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              {{ $t('settings.security.delete.button') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  const router = useRouter()
  const userStore = useUserStore()
  
  // 用户信息表单
  const userInfo = reactive({
    username: userStore.username || '',
    email: userStore.email || '',
    phone: '',
    nickname: ''
  })
  
  // 密码修改表单
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // 保存用户信息
  const saveUserInfo = () => {
    // 这里实现保存用户信息的逻辑
    // 例如：发送请求到后端更新用户信息
    
    // 模拟成功保存
    setTimeout(() => {
      ElMessage.success(t('settings.profile.saveSuccess'))
    }, 500)
  }
  
  // 修改密码
  const changePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      ElMessage.error(t('settings.password.mismatch'))
      return
    }
    
    // 这里实现修改密码的逻辑
    // 例如：发送请求到后端更新密码
    
    // 模拟成功修改
    setTimeout(() => {
      ElMessage.success(t('settings.password.changeSuccess'))
      
      // 重置表单
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }, 500)
  }
  
  // 退出登录
  const logout = async () => {
    try {
      await userStore.clearUser()
      ElMessage.success(t('settings.security.logout.success'))
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  // 确认注销账号
  const confirmDeleteAccount = () => {
    ElMessageBox.confirm(
      t('settings.security.delete.confirmMessage'),
      t('settings.security.delete.confirmTitle'),
      {
        confirmButtonText: t('settings.security.delete.confirm'),
        cancelButtonText: t('settings.security.delete.cancel'),
        type: 'warning'
      }
    ).then(() => {
      // 这里实现注销账号的逻辑
      // 例如：发送请求到后端删除账号
      
      // 模拟成功注销
      setTimeout(() => {
        ElMessage.success(t('settings.security.delete.success'))
        userStore.clearUser()
        router.push('/auth')
      }, 500)
    }).catch(() => {})
  }
  </script> 
  
  <style scoped>
  /* 可以添加特定于此组件的样式 */
  </style> 