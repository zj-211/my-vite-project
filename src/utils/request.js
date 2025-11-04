// src/utils/request.js
import axios from 'axios'
// ✅ （1）建议：如果你使用了 Element Plus，可以加上全局消息提示
// import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: true, // ✅ 这个可以保留，因为后端设置了 CORS_ALLOW_CREDENTIALS
})

// === ✅ 1. 每次请求前自动携带 access token ===
service.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access')
    if (access) {
      config.headers['Authorization'] = `Bearer ${access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// === ✅ 2. 处理响应错误（例如 401 Token 过期） ===
service.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // 🟡（2）建议：401 逻辑没问题，但刷新接口建议使用相对路径而不是固定 IP
    // ✅ 改动：从固定后端 IP 改成 baseURL 路径，更通用（避免不同电脑 IP 改动）
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('refresh')

      if (refresh) {
        try {
          // ✅ 改动1：用 service 或 axios 统一前缀，不写死 IP
          const res = await axios.post('/api/token/refresh/', {
            refresh: refresh,
          })

          // ✅ 改动2：更新全局 axios 头（你原来这行没问题）
          const newAccess = res.data.access
          localStorage.setItem('access', newAccess)
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`

          // ✅ 改动3：使用 service 再次发请求（保证使用相同拦截器）
          return service(originalRequest)
        } catch (err) {
          // ✅ 改动4：增强报错提示
          console.error('刷新 Token 失败，请重新登录')
          // ElMessage?.error?.('登录过期，请重新登录')
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          window.location.href = '/login'
        }
      } else {
        console.warn('未找到 refresh token，请重新登录')
        window.location.href = '/login'
      }
    }

    // 🟡（3）建议：可选的用户提示（更友好）
    // if (status === 403) ElMessage.error('无权限访问')
    // if (status >= 500) ElMessage.error('服务器错误，请稍后重试')

    return Promise.reject(error)
  }
)

export default service
