import { defineStore } from 'pinia'
import { getCategories } from '../api/home'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getCategoryRoute: (state) => (categoryName) => {
      const routeMap = {
        '美妆护肤': 'beauty',
        '服饰鞋包': 'clothing',
        '数码电器': 'electronics',
        '家居生活': 'home',
        '图书文具': 'books',
        '进口食品': 'food',
        '玩具母婴': 'toys'
      }
      return routeMap[categoryName] || categoryName.toLowerCase()
    }
  },

  actions: {
    async fetchCategories() {
      if (this.categories.length > 0) return // 如果已有数据，不重复获取
      
      this.isLoading = true
      this.error = null
      try {
        const response = await getCategories()
        if (response.data.status === 'success') {
          this.categories = response.data.categories
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
}) 