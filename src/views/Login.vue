<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">账户登录</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 用户名/邮箱输入 -->
        <div class="form-group">
          <label for="username">用户名/邮箱</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            @blur="validateField('username')"
            :class="{ 'is-invalid': formErrors.username }"
            placeholder="请输入用户名或邮箱"
            required
          >
          <p class="error-message">{{ formErrors.username }}</p>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              @blur="validateField('password')"
              :class="{ 'is-invalid': formErrors.password }"
              placeholder="请输入密码"
              required
            >
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
          <p class="error-message">{{ formErrors.password }}</p>
        </div>

        <!-- 记住密码和忘记密码 -->
        <div class="form-actions">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember">
            记住我
          </label>
          <a href="/forgot-password" class="forgot-password">忘记密码？</a>
        </div>

        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading">登录中...</span>
          <span v-else>登录</span>
        </button>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账户？<a href="/register">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单数据
const form = reactive({
  username: '',
  password: '',
  remember: false
})

const formErrors = reactive({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

/**
 * 表单验证
 */
const validateField = (field) => {
  switch (field) {
    case 'username':
      formErrors.username = form.username.trim()
        ? ''
        : '请输入用户名或邮箱'
      break
    case 'password':
      formErrors.password = form.password
        ? ''
        : '请输入密码'
      break
  }
}

const validateForm = () => {
  validateField('username')
  validateField('password')
  return !formErrors.username && !formErrors.password
}

/**
 * 登录逻辑
 */
const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const response = await axios.post('/api/user/auth/', {
      action: 'login',
      account: form.username,
      password: form.password
    })

    // ✅ Django SimpleJWT 返回 access & refresh
    const { access, refresh } = response.data

    // ✅ 存储 token
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    // ✅ 设置全局 axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`

    ElMessage.success('登录成功！')
    console.log('登录成功，Token 已存储：', access, refresh)

    // ✅ 跳转主页
    setTimeout(() => router.push('/home'), 800)
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.response?.data?.error || '账号或密码错误，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>



<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.login-title {
  margin: 0 0 25px;
  text-align: center;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983; /* Vue的绿色主题色 */
}

.form-group input.is-invalid {
  border-color: #e53e3e;
}

.error-message {
  margin: 5px 0 0;
  color: #e53e3e;
  font-size: 14px;
  height: 20px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
  color: #555;
  font-size: 14px;
}

.remember-me input {
  margin-right: 5px;
}

.forgot-password {
  color: #42b983;
  font-size: 14px;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #359e6d;
}

.login-btn:disabled {
  background-color: #a0d9b9;
  cursor: not-allowed;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #555;
  font-size: 14px;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
