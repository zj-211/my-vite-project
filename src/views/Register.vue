<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <div class="bg-white shadow-xl rounded-2xl p-10 w-[400px]">
      <h2 class="text-2xl font-semibold text-center mb-6">注册新账号</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">用户名</label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">账号</label>
          <input
            v-model="account"
            type="text"
            placeholder="请输入账号"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-2">密码</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span
            class="absolute right-4 top-10 text-green-500 cursor-pointer"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </span>
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          注册
        </button>
      </form>

      <p class="text-center mt-6 text-gray-600">
        已有账号？
        <router-link to="/login" class="text-green-600 hover:underline">
          返回登录
        </router-link>
      </p>
    </div>
  </div>
</template>


<script setup>
import axios from 'axios'
import { ref } from 'vue'

const username = ref('')
const account = ref('')
const password = ref('')
const showPassword = ref(false)

const handleRegister = async () => {
  try {
    console.log('注册请求发送中...');
    const response = await axios.post('/api/user/auth/', {
      action: 'register',
      username: username.value,
      account: account.value,
      password: password.value
    }, {
      headers: {
        Authorization: '',
      }
    });

    if (response.status === 201) {
      alert('注册成功，请登录！');
      window.location.href = '/login';
    } else {
      console.warn('后端返回：', response.data);
      alert(response.data.error || '注册失败，请重试');
    }
  } catch (error) {
    console.error('注册失败：', error.response?.data || error.message);
    if (error.response?.status === 401) {
      alert('请求被拒绝：请确认后端允许匿名注册！');
    } else if (error.response?.status === 400) {
      alert('注册参数错误，请检查用户名、账号或密码');
    } else if (error.response?.status === 500) {
      alert('服务器内部错误，请查看后端日志');
    } else {
      alert('服务器连接失败，请检查后端是否运行');
    }
  }
};
</script>



<style scoped>
input::placeholder {
  color: #aaa;
}
</style>
