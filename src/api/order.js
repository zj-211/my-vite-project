import request from '@/utils/request'

// 获取订单列表
export const getOrderList = () => {
  return request({
    url: '/api/order/orders/',
    method: 'get'
  })
}

// 确认收货
export const confirmReceive = (orderId) => {
  return request({
    url: `/api/order/orders/${orderId}/confirm/`,
    method: 'post'
  })
}

// 支付订单
export const payOrder = (orderId) => {
  return request({
    url: '/api/payment/mock-pay/',
    method: 'post',
    data: {
      order_id: orderId,
      total_amount: 484  // 这里应该从订单数据中获取实际金额
    }
  })
} 