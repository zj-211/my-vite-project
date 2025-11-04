import request from '@/utils/request'
import { useI18n } from 'vue-i18n'

// 获取首页数据
export function getHomeData() {
    return request({
        url: '/api/trade/home/',
        method: 'get'
    })
}

// 获取分类列表
export function getCategories() {
    return request({
        url: '/api/trade/categories/',
        method: 'get'
    })
}

// 获取分类下的商品列表
export function getCategoryGoods(cid) {
    // export function getCategoryGoods(categoryId) {
    return request({
        url: `/api/trade/category/${cid}/`,
        method: 'get'
        // url: '/api/trade/goods/',
        // method: 'get',
        // params: {
        //   category: categoryId
        // }
    })
}

// 获取商品详情
export function getGoodsDetail(goods_id) {
    const { locale } = useI18n()
    return request({
        url: `/api/trade/goods/${goods_id}/`,
        method: 'get',
        params: {
            lang: locale.value
        }
    })
}

// 获取首页热门商品
export function getHotGoods() {
    return request({
        url: '/api/trade/home/',
        method: 'get'
    })
}

// 获取商品列表
export const getGoodsList = (params = {}) => {
    const { locale } = useI18n()
    return request({
        url: '/api/goods/',
        method: 'get',
        params: {
            ...params,
            lang: locale.value
        }
    })
}

// 创建商品（管理员使用）
export const createGoods = (data) => {
    return request({
        url: '/api/goods/',
        method: 'post',
        data: {
            ...data,
            // 添加多语言数据
            name_i18n: {
                zh: data.name_zh,
                en: data.name_en
            },
            description_i18n: {
                zh: data.description_zh,
                en: data.description_en
            },
            brand_i18n: {
                zh: data.brand_zh,
                en: data.brand_en
            }
        }
    })
}

// 更新商品（管理员使用）
export const updateGoods = (goodsId, data) => {
    return request({
        url: `/api/goods/${goodsId}/`,
        method: 'put',
        data: {
            ...data,
            // 添加多语言数据
            name_i18n: {
                zh: data.name_zh,
                en: data.name_en
            },
            description_i18n: {
                zh: data.description_zh,
                en: data.description_en
            },
            brand_i18n: {
                zh: data.brand_zh,
                en: data.brand_en
            }
        }
    })
} 