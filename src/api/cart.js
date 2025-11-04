import request from '../utils/request'

// 添加商品到购物车
export function addToCart(goodsId, quantity = 1) {
    return request({
        url: `/api/cart/add/${goodsId}/`,
        method: 'post',
        data: { num: quantity }
    })
}

// 获取购物车详情
export function getCartDetail() {
    return request({
        url: '/api/cart/detail/',
        method: 'get'
    })
}

// 从购物车移除商品
export function removeFromCart(itemId) {
    return request({
        url: `/api/cart/remove/${itemId}/`,
        method: 'post'
    })
}

// 更新购物车商品数量
export function updateCart(itemId, num) {
    if (typeof num !== 'number' || num < 1) {
        throw new Error('商品数量必须是大于0的数字')
    }
    return request({
        url: `/api/cart/update/${itemId}/`,
        method: 'post',
        data: { num }
    })
}

// 购物车结算
export function checkout() {
    return request({
        url: '/api/cart/checkout/',
        method: 'post'
    })
} 