import request from '../utils/request'

// 用户认证（登录/注册）
export function auth(data) {
    return request({
        url: '/api/user/auth/',
        method: 'post',
        data
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/api/user/info/',
        method: 'get'
    })
}

// 退出登录
export function logout() {
    return request({
        url: '/api/user/logout/',
        method: 'post'
    })
}

// 获取地址列表
export function getAddressList() {
    return request({
        url: '/api/user/addresses/',
        method: 'get'
    })
}

// 添加新地址
export function addAddress(data) {
    return request({
        url: '/api/user/addresses/',
        method: 'post',
        data
    })
}

// 修改地址
export function updateAddress(id, data) {
    return request({
        url: `/api/user/addresses/${id}/`,
        method: 'put',
        data
    })
}

// 删除地址
export function deleteAddress(id) {
    return request({
        url: `/api/user/addresses/${id}/`,
        method: 'delete'
    })
}

// 获取实名认证信息
export function getRealNameInfo() {
    return request({
        url: '/api/user/realname/',
        method: 'get'
    })
}

// 提交实名认证
export function submitRealName(data) {
    return request({
        url: '/api/user/realname/',
        method: 'post',
        data
    })
} 