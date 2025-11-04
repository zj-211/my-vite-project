<template>
    <div class="container mx-auto px-8 py-20">
      <div class="max-w-2xl mx-auto text-center">
        <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <i class="fas fa-check text-green-500 text-4xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ $t('orderSuccess.title') }}</h1>
        <p class="text-gray-600 mb-8">{{ $t('orderSuccess.message') }} {{ orderNumber }}</p>
        <div class="space-x-4">
          <router-link 
            to="/" 
            class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('orderSuccess.actions.continueShopping') }}
          </router-link>
          <router-link 
            to="/account" 
            class="inline-block bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ $t('orderSuccess.actions.viewOrder') }}
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  const orderNumber = ref('')
  
  onMounted(() => {
    // 生成订单号 (这里使用时间戳作为示例)
    orderNumber.value = `ORD${Date.now()}`
  })
  </script>
  
  <style scoped>
  .order-success {
    padding: 4rem 0;
    min-height: calc(100vh - 60px - 300px);
    display: flex;
    align-items: center;
  }
  
  .success-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .success-icon {
    width: 80px;
    height: 80px;
    background-color: var(--success-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin: 0 auto 2rem;
  }
  
  h1 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-color);
    margin-bottom: 2rem;
  }
  
  .order-number {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .view-order-btn,
  .continue-shopping-btn {
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .view-order-btn {
    background-color: var(--primary-color);
    color: white;
  }
  
  .view-order-btn:hover {
    background-color: var(--primary-color-dark);
  }
  
  .continue-shopping-btn {
    background-color: white;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
  
  .continue-shopping-btn:hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
    }
    
    .view-order-btn,
    .continue-shopping-btn {
      width: 100%;
    }
  }
  </style> 