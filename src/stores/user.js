import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    refreshToken: '',
    username: '',  // 实际的用户名
    account: '',   // 账号
    userId: '',   // 用户ID
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    // 确保始终返回一个有效的显示名称
    displayName: (state) => state.username || state.account || '未登录'
  },
  
  actions: {
    async setUser({ token, refreshToken, username, account,userId }) {
      // 存储 access token
      this.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`
      // 存储 refresh token
      this.refreshToken = refreshToken
      // 确保用户名和账号的存储
      this.username = username || ''
      this.account = account || ''
      this.userId = userId || '' // 存储用户ID

      // 保存到本地存储
      localStorage.setItem('token', this.token)
      localStorage.setItem('refreshToken', this.refreshToken)
      localStorage.setItem('username', this.username)
      localStorage.setItem('account', this.account) 
      localStorage.setItem('userId', this.userId) // 保存用户ID
    },

    async clearUser() {
      // 清除状态
      this.token = ''
      this.refreshToken = ''
      this.username = ''
      this.account = ''
      this.userId = '' // 清除用户ID

      // 清除所有本地存储
      localStorage.clear()
    },

    // 初始化时检查登录状态
    initializeStore() {
      // 如果没有有效的 token，清除所有存储
      const token = localStorage.getItem('token')
      if (!token) {
        this.clearUser()
      } else {
        // 如果有 token，恢复状态
        this.token = token
        this.refreshToken = localStorage.getItem('refreshToken') || ''
        this.username = localStorage.getItem('username') || ''
        this.account = localStorage.getItem('account') || ''
        this.userId = localStorage.getItem('userId') || '' // 恢复用户ID
      }
    }
  }
}) 