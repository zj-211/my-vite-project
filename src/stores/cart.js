import { defineStore } from 'pinia'
import { addToCart, getCartDetail, removeFromCart, updateCart, checkout } from '../api/cart'
import { ElMessage } from 'element-plus'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    getters: {
        totalItems: (state) => state.items.reduce((sum, item) => sum + item.num, 0),
        totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.num), 0)
    },

    actions: {
        // 获取购物车详情
        async fetchCartItems() {
            this.loading = true
            this.error = null
            try {
                const response = await getCartDetail()
                console.log('获取购物车响应:', response)
                if (response.data.status === 'success') {
                    this.items = response.data.cart || []
                    return true
                }
                return false
            } catch (error) {
                console.error('获取购物车失败:', error)
                this.error = error.message
                ElMessage.error('获取购物车信息失败')
                return false
            } finally {
                this.loading = false
            }
        },

        // 添加商品到购物车
        async addItem(goodsId, quantity = 1) {
            if (!goodsId) {
                console.error('商品ID不能为空')
                return false
            }

            if (quantity < 1) {
                console.error('商品数量必须大于0')
                return false
            }

            this.loading = true
            this.error = null
            try {
                console.log('正在添加商品到购物车, ID:', goodsId, '数量:', quantity)
                const response = await addToCart(goodsId, quantity)
                console.log('添加购物车响应:', response)
                
                if (response.data.status === 'success') {
                    // 添加成功后刷新购物车数据
                    await this.fetchCartItems()
                    return true
                }
                
                // 如果后端返回了错误信息，显示给用户
                if (response.data.message) {
                    ElMessage.error(response.data.message)
                }
                return false
            } catch (error) {
                console.error('添加到购物车失败:', error)
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // 从购物车移除商品
        async removeItem(itemId) {
            if (!itemId) return false
            
            try {
                const response = await removeFromCart(itemId)
                if (response.data.status === 'success') {
                    // 从本地状态中移除商品
                    this.items = this.items.filter(item => item.id !== itemId)
                    return true
                }
                return false
            } catch (error) {
                console.error('移除商品失败:', error)
                throw error
            }
        },

        // 更新购物车商品数量
        async updateItemQuantity(itemId, num) {
            if (!itemId || num < 1) return false
            
            try {
                const response = await updateCart(itemId, num)
                if (response.data.status === 'success') {
                    // 更新本地状态中的商品数量
                    const item = this.items.find(item => item.id === itemId)
                    if (item) {
                        item.num = num
                    }
                    return true
                }
                return false
            } catch (error) {
                console.error('更新数量失败:', error)
                throw error
            }
        },

        // 结算购物车
        async checkoutCart() {
            try {
                const response = await checkout()
                if (response.data.status === 'success') {
                    this.items = []
                    ElMessage.success('结算成功，订单号: ' + response.data.order_num)
                    return {
                        orderId: response.data.order_id,
                        orderNum: response.data.order_num,
                        total: response.data.total_amount
                    }
                } else {
                    ElMessage.error(response.data.message || '结算失败')
                    return null
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message
                ElMessage.error(`结算出错: ${errorMsg}`)
                console.error('结算错误详情:', error)
                throw error
            }
        },
        // 清空购物车
        clearCart() {
            this.$patch({
                items: [],
                totalItems: 0
              });
        }
    }
}) 